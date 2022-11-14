class NotFoundError extends Error {
  public statusCode: 404;

  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
