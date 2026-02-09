import { createArticle } from '@socialpublisher/core';

export function articleBuilder(overrides: Partial<any> = {}) {
  return createArticle({
    id: 'id-' + Math.random(),
    title: 'Default title',
    slug: 'default-slug-' + Math.random(),
    body: 'body',
    ...overrides,
  });
}