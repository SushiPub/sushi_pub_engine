import { Request, Response } from 'express';
import { ArticleService } from '@socialpublisher/data';
import { createArticle } from '@socialpublisher/core';

export function createArticleController(
  articleService: ArticleService,
  articleRepo: any
) {
  return {
    async create(req: Request, res: Response) {
      try {
        const article = createArticle(req.body);

        await articleService.create(article);

        res.status(201).json({ id: article.id });
      } catch (err: any) {
        res.status(400).json({ error: err.message });
      }
    },

    async publish(req: Request, res: Response) {
      try {
        await articleService.publishArticle(req.params.id);
        res.status(204).send();
      } catch (err: any) {
        res.status(400).json({ error: err.message });
      }
    },

    async getBySlug(req: Request, res: Response) {
      const article = await articleRepo.findBySlug(req.params.slug);

      if (!article) {
        return res.status(404).send();
      }

      res.json(article);
    },
  };
}