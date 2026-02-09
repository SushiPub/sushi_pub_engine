import { Router } from 'express';
import { createArticleController } from '../controllers/article.controller';
import { createArticleRepository } from '@socialpublisher/data';
import { ArticleService } from '@socialpublisher/data';
import knex from 'knex';

export function createAdminRouter() {
  const router = Router();

  // --- Infrastructure wiring ---
  const db = knex({
    client: 'pg',
    connection: process.env.DATABASE_URL,
  });

  const articleRepoFactory = (dbConn: any) =>
    createArticleRepository(dbConn);

  const articleService = new ArticleService(db, articleRepoFactory);

  const articleController = createArticleController(
    articleService,
    articleRepoFactory(db)
  );

  // --- Routes ---
  router.post('/articles', articleController.create);
  router.post('/articles/:id/publish', articleController.publish);
  router.get('/articles/:slug', articleController.getBySlug);

  return router;
}