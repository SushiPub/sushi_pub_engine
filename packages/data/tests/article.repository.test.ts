import '../src/bootstrap';

import { createDb } from '../src/db/db';
import { createArticleRepository } from '../src/article/article.repository';
import { createArticle } from '@socialpublisher/core';

const db = createDb();
const articlesRepo = createArticleRepository(db);

beforeAll(async () => {
  // ✅ Ensure schema exists (via migrations)
  await db.migrate.latest();
});

beforeEach(async () => {
  // ✅ Clean data only (safe, fast)
  await db('articles').truncate();
});

afterAll(async () => {
  await db.destroy();
});

test('insert and read article', async () => {
  const article = createArticle({
    id: '11111111-1111-1111-1111-111111111111',
    title: 'DB Test',
    slug: 'db-test',
    body: 'Stored in postgres',
  });

  await articlesRepo.insert(article);

  const result = await articlesRepo.findBySlug('db-test');

  expect(result).not.toBeNull();
  expect(result?.title).toBe('DB Test');
});