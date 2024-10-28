class AuthError extends Error {
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static unAuthorizedError() {
    return new AuthError(401, 'User credentials error');
  }

  static badRequest(message, errors = []) {
    return new AuthError(400, message, errors);
  }
}

module.exports = AuthError;
