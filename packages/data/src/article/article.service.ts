import {
  Article,
  DuplicateArticleSlugError,
  InvalidArticleStateError,
} from '@socialpublisher/core';
import { ArticleRepository } from './article.repository';
import { Knex } from 'knex';
import { withTransaction } from '../db/transaction';

/**
 * ArticleService
 *
 * This class represents the **application/service layer** for Articles.
 * It orchestrates business rules and persistence.
 *
 * IMPORTANT:
 * - It does NOT know SQL
 * - It does NOT know HTTP
 * - It DOES enforce business workflows
 */ 
export class ArticleService {
  /**
   * @param db            Root database connection (Knex)
   * @param repoFactory   Factory that creates repositories bound to a DB or transaction
   */
  constructor(
    private readonly db: Knex,
    private readonly repoFactory: (db: Knex) => ArticleRepository
  ) {}

  /**
   * Create a new article
   *
   * Business rules:
   * - Slug must be unique
   *
   * NOTE:
   * - No transaction is needed here yet because this is a single write.
   * - If later we add audit logs, events, etc → we can wrap it in a transaction.
   */
  async create(article: Article): Promise<void> {
    const repo = this.repoFactory(this.db);

    const existing = await repo.findBySlug(article.slug);
    if (existing) {
      throw new DuplicateArticleSlugError(article.slug);
    }

    await repo.insert(article);
  }

  /**
   * Publish an article
   *
   * This is a **workflow**, not a simple update.
   * Therefore it MUST be transactional.
   *
   * Business rules:
   * - Article must exist
   * - Only draft articles can be published
   * - Publishing updates status and timestamps atomically
   */
  async publishArticle(articleId: string): Promise<void> {
    await withTransaction(this.db, async (trx) => {
      // 🔁 Create repositories bound to THIS transaction
      const repo = this.repoFactory(trx);

      // 1️⃣ Load article
      const article = await repo.findById(articleId);
      if (!article) {
        throw new Error('Article not found');
      }

      // 2️⃣ Enforce state machine
      if (article.status !== 'draft') {
        throw new InvalidArticleStateError(
          `Cannot publish article in state "${article.status}"`
        );
      }

      // 3️⃣ Apply state transition
      const published: Article = {
        ...article,
        status: 'published',
        updatedAt: new Date(),
      };

      // 4️⃣ Persist changes
      await repo.update(published);

      // 5️⃣ Future-safe extension points
      // await auditLogRepo.insert(...)
      // await outboxRepo.enqueueSocialPublish(...)
    });
  }
}