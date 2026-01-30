import { Article, DuplicateArticleSlugError } from '@socialpublisher/core';
export interface ArticleRepository {
  insert(article: Article): Promise<void>;
  findBySlug(slug: string): Promise<Article | null>;
}

export class ArticleService {
  constructor(private readonly repo: ArticleRepository) {}

  async create(article: Article) {
    const existing = await this.repo.findBySlug(article.slug);
    if (existing) {
      throw new DuplicateArticleSlugError(article.slug);
    }

    await this.repo.insert(article);
  }
}