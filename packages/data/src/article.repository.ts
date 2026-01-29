import { db } from './db';
import { Article } from '@socialpublisher/core';

export async function insertArticle(article: Article): Promise<void> {
  await db('articles').insert({
    id: article.id,
    title: article.title,
    slug: article.slug,
    body: article.body,
    status: article.status,
    created_at: article.createdAt,
    updated_at: article.updatedAt,
  });
}

export async function findArticleBySlug(
  slug: string
): Promise<Article | null> {
  const row = await db('articles').where({ slug }).first();
  if (!row) return null;

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    body: row.body,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}