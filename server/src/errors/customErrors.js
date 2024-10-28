class CustomError extends Error {
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static badRequest(message, errors = []) {
    return new CustomError(400, message, errors);
  }

  static notFound(message, errors = []) {
    return new CustomError(404, message, errors);
  }
}

module.exports = CustomError;
