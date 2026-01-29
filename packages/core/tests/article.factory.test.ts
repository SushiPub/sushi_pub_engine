import { createArticle } from '../src/article/article.factory';

describe('createArticle', () => {
  test('creates article with default draft status', () => {
    const article = createArticle({
      id: '1',
      title: 'Hello World',
      slug: 'hello-world',
      body: 'My first article',
    });

    console.log(article); // 👈 THIS IS OK IN TESTS

    expect(article.status).toBe('draft');
    expect(article.title).toBe('Hello World');
    expect(article.slug).toBe('hello-world');
    expect(article.createdAt).toBeInstanceOf(Date);
    expect(article.updatedAt).toBeInstanceOf(Date);
  });

  test('creates article with provided status', () => {
    const article = createArticle({
      id: '2',
      title: 'Published article',
      slug: 'published',
      body: 'Live now',
      status: 'published',
    });

    expect(article.status).toBe('published');
  });
});