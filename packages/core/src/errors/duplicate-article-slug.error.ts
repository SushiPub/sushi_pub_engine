export class DuplicateArticleSlugError extends Error {
  constructor(slug: string) {
    super(`An article with the slug "${slug}" already exists.`);
    this.name = 'DuplicateArticleSlugError';
  }
}   