export class InvalidArticleStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidArticleStateError';
  }
}