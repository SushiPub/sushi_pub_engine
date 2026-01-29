import { ArticleStatus } from "./article.status";

export interface Article {
  id: string;
  title: string;
  slug: string;
  body: string;
  status: ArticleStatus;
  createdAt: Date;
  updatedAt: Date;
}