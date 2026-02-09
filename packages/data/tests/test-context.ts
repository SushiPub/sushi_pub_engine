import { ArticleService } from '../src/article/article.service';

// ✅ Tests no longer care about construction details

// ✅ Easy to add new services

// ✅ Easy to add new repositories

// ✅ Matches “application container” pattern

// ✅ Explicit separation of commands vs reads

export function createTestContext() {
  // --- In-memory state ---
  const articles = new Map<string, any>();

  // --- Fake repositories ---
  const articleRepo = {
    insert: async (article: any) => {
      articles.set(article.id, article);
    },
    findBySlug: async (slug: string) => {
      return [...articles.values()].find(a => a.slug === slug) ?? null;
    },
    findById: async (id: string) => {
      return articles.get(id) ?? null;
    },
    update: async (article: any) => {
      articles.set(article.id, article);
    },
  };

  // --- Fake DB ---
  const fakeDb = {};

  // --- Repo factory (transaction-safe) ---
  const repoFactory = (_db: any) => articleRepo;

  // --- Services ---
  const articleService = new ArticleService(
    fakeDb as any,
    repoFactory
  );

  return {
    // Services (commands)
    articleService,

    // Repositories (read access for assertions)
    repos: {
      articleRepo,
    },

    // Raw state (rarely used)
    state: {
      articles,
    },
  };
}