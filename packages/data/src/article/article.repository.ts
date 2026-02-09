import { Knex } from 'knex';
import { Article } from '@socialpublisher/core';

const ARTICLES_TABLE = 'articles';


/**
 * Repository contract
 * This is the abstraction the SERVICE depends on
 */
export interface ArticleRepository {
  insert(article: Article): Promise<void>;
  findBySlug(slug: string): Promise<Article | null>;
  findById(id: string): Promise<Article | null>;
  update(article: Article): Promise<void>;
}

/**
 * Repository factory
 * This is the INFRASTRUCTURE implementation
 *
 * Important:
 * - Explicitly RETURNS ArticleRepository
 * - Enforces the contract at compile time
 */
export function createArticleRepository(db: Knex): ArticleRepository {
  return {
    async insert(article: Article): Promise<void> {
      await db(ARTICLES_TABLE).insert({
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
      const row = await db(ARTICLES_TABLE).where({ slug }).first();
      if (!row) return null;

      return mapRowToArticle(row);
    },

    async findById(id: string): Promise<Article | null> {
      const row = await db(ARTICLES_TABLE).where({ id }).first();
      if (!row) return null;

      return mapRowToArticle(row);
    },

    async update(article: Article): Promise<void> {
      await db(ARTICLES_TABLE)
        .where({ id: article.id })
        .update({
          title: article.title,
          slug: article.slug,
          body: article.body,
          status: article.status,
          updated_at: article.updatedAt,
        });
    },
  };
}

/**
 * Row → Domain mapper
 * Keeps persistence concerns isolated
 */
function mapRowToArticle(row: any): Article {
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