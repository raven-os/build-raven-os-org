const CustomError = require('./custom-error')

class NotFound extends CustomError {
  constructor (message, ...args) {
    super(message || 'Not found', ...args)
    this.status = 404
    this.name = 'Not found'
  }
}

module.exports = NotFound
