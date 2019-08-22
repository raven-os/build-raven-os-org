const CustomError = require('./custom-error')

class InternalServerError extends CustomError {
  constructor (message, ...args) {
    super(message || 'Internal Server Error', ...args)
    this.status = 500
    this.name = 'Internal Server Error'
  }
}

module.exports = InternalServerError
