const CustomError = require('./custom-error')

class BadRequest extends CustomError {
  constructor (message, ...args) {
    super(message || 'Bad request', ...args)
    this.status = 400
    this.name = 'Bad Request'
  }
}

module.exports = BadRequest
