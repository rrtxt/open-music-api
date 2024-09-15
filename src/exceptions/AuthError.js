const ClientError = require("./ClientError");

class AuthenticationError extends ClientError {
  constructor(message) {
    super(message, 401)
    this.name = 'AuthenticationError'
  }
}

class AuthorizationError extends ClientError {
  constructor(message) {
    super(message, 403)
    this.name = 'AuthorizationError'
  }
}



module.exports = { AuthenticationError, AuthorizationError }
