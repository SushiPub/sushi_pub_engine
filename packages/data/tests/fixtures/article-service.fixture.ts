import { ArticleService } from '../../src/article/article.service';

export function createArticleServiceTestFixture() {
  const store = new Map<string, any>();

  const repo = {
    insert: async (article: any) => {
      store.set(article.id, article);
    },
    findBySlug: async (slug: string) => {
      return [...store.values()].find((a) => a.slug === slug) ?? null;
    },
    findById: async (id: string) => {
      return store.get(id) ?? null;
    },
    update: async (article: any) => {
      store.set(article.id, article);
    },
  };

  const fakeDb = {};

  const repoFactory = () => repo;

  const service = new ArticleService(fakeDb as any, repoFactory);

  return {
    service,
    repo,
    store,
  };
}