
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
import { ArticleService } from '../src/article/article.service';
import { createArticleServiceTestFixture } from './fixtures/article-service.fixture';

jest.mock('../src/db/transaction', () => ({
  withTransaction: async (_db: any, fn: any) => {
    // Call the function directly, no real transaction
    return fn(_db);
  },
}));


describe('ArticleService', () => {
  let service: ArticleService;
  let repo: any;


  beforeEach(() => {
    const fixture = createArticleServiceTestFixture();
    service = fixture.service;
    repo = fixture.repo;
  });

  test('creates article when slug is unique', async () => {

    const { service, repo } = createArticleServiceTestFixture();

    const article = createArticle({
      id: '1',
      title: 'Hello',
      slug: 'hello',
      body: 'World',
    });

    await service.create(article);

    const stored = await repo.findBySlug('hello');
    expect(stored).not.toBeNull();
  });

  test('throws error when slug already exists', async () => {

    const article = createArticle({
      id: '1',
      title: 'Hello',
      slug: 'hello',
      body: 'World',
    });

    await service.create(article);

    await expect(service.create(article)).rejects.toThrow(
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

    await service.create(article);
    await service.publishArticle(article.id);

    const updated = await repo.findById(article.id);

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

    await repo.insert(article);

    await expect(
      service.publishArticle(article.id)
    ).rejects.toBeInstanceOf(InvalidArticleStateError);
  });
});