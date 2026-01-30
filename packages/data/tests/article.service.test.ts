
import { createArticle } from '@socialpublisher/core';
import { ArticleService } from '../src/article/article.service';

function createFakeRepo() {
  const articles = new Map<string, any>();

  return {
    findBySlug: async (slug: string) => articles.get(slug) ?? null,
    insert: async (article: any) => {
      articles.set(article.slug, article);
    },
  };
}

test('creates article when slug is unique', async () => {
  const repo = createFakeRepo();
  const service = new ArticleService(repo);

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
  const repo = createFakeRepo();
  const service = new ArticleService(repo);

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