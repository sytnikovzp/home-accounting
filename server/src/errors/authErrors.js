class AuthError extends Error {
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static unAuthorizedError() {
    return new AuthError(401, 'User is not authorized');
  }
}

module.exports = AuthError;
