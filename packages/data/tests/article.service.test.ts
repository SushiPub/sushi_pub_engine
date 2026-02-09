
/**
 * Test suite for the `ArticleService` class.
 *
 * This suite covers the following scenarios:
 * - Creating an article with a unique slug.
 * - Handling creation when the article slug already exists.
 * - Publishing a draft article and verifying its status and update timestamp.
 * - Preventing publishing of an already published article and ensuring the correct error is thrown.
 *
 * Mocks the transaction layer to avoid real database transactions during tests.
 *
 * @module tests/article.service.test
 */
import { createArticle, InvalidArticleStateError } from '@socialpublisher/core';
import { articleBuilder } from './builders/article.builder';
import { createTestContext } from './test-context';

jest.mock('../src/db/transaction', () => ({
  withTransaction: async (_db: any, fn: any) => {
    // Call the function directly, no real transaction
    return fn(_db);
  },
}));


describe('ArticleService', () => {
  let ctx: ReturnType<typeof createTestContext>;

  beforeEach(() => {
    ctx = createTestContext();
  });

  test('creates article when slug is unique', async () => {

    const article = articleBuilder({ status: 'published', slug: 'hello' });

    await ctx.articleService.create(article);

    const stored = await ctx.repos.articleRepo.findBySlug('hello');
    expect(stored).not.toBeNull();
  });

  test('throws error when slug already exists', async () => {

    const article = createArticle({
      id: '1',
      title: 'Hello',
      slug: 'hello',
      body: 'World',
    });

    await ctx.articleService.create(article);

    await expect(ctx.articleService.create(article)).rejects.toThrow(
      'already exists'
    );
  });

  test('publishes a draft article', async () => {


    const article = createArticle({
      id: 'a1',
      title: 'Draft',
      slug: 'draft',
      body: 'content',
    });

    await ctx.articleService.create(article);
    await ctx.articleService.publishArticle(article.id);

    const updated = await ctx.repos.articleRepo.findById(article.id);

    expect(updated.status).toBe('published');
    expect(updated.updatedAt).toBeInstanceOf(Date);
  });

  test('cannot publish already published article', async () => {

    const article = {
      ...createArticle({
        id: 'a2',
        title: 'Published',
        slug: 'published',
        body: 'content',
      }),
      status: 'published' as const,
    };

    await ctx.repos.articleRepo.insert(article);

    await expect(
      ctx.articleService.publishArticle(article.id)
    ).rejects.toBeInstanceOf(InvalidArticleStateError);
  });
});