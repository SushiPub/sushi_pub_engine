import { db } from '../src/db';
import { insertArticle, findArticleBySlug } from '../src/article.repository';
import { createArticle } from '@socialpublisher/core';

beforeAll(async () => {
  await db.schema.dropTableIfExists('articles');
  await db.schema.createTable('articles', (t) => {
    t.uuid('id').primary();
    t.text('title');
    t.text('slug').unique();
    t.text('body');
    t.text('status');
    t.timestamp('created_at');
    t.timestamp('updated_at');
  });
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

  await insertArticle(article);

  const result = await findArticleBySlug('db-test');

  expect(result).not.toBeNull();
  expect(result?.title).toBe('DB Test');
});