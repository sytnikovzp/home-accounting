class AuthError extends Error {
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static unAuthorizedError() {
    return new AuthError(401, 'Перевірте облікові дані');
  }
}

module.exports = AuthError;
