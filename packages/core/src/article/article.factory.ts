import { Article } from './article.types';
import { ArticleStatus } from './article.status';

type CreateArticleInput = {
  id: string;
  title: string;
  slug: string;
  body: string;
  status?: ArticleStatus;
};

export function createArticle(input: CreateArticleInput): Article {
  const now = new Date();

  return {
    id: input.id.trim(),
    title: input.title.trim(),
    slug: input.slug.trim(),
    body: input.body,
    status: input.status ?? 'draft',
    createdAt: now,
    updatedAt: now,
  };
}