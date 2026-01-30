import { Knex } from 'knex';
import { Article } from '@socialpublisher/core';

export interface ArticleRepository {
  insert(article: Article): Promise<void>;
  findBySlug(slug: string): Promise<Article | null>;
  findById(id: string): Promise<Article | null>;
  update(article: Article): Promise<void>;
}

export function createArticleRepository(db: Knex) {
  return {
    async insert(article: Article): Promise<void> {
      await db('articles').insert({
        id: article.id,
        title: article.title,
        slug: article.slug,
        body: article.body,
        status: article.status,
        created_at: article.createdAt,
        updated_at: article.updatedAt,
      });
    },

    async findBySlug(slug: string): Promise<Article | null> {
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
    },
  };
}