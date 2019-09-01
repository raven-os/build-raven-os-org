const CustomError = require('./custom-error')

class Unauthorized extends CustomError {
  constructor (message, ...args) {
    super(message || 'Unauthorized', ...args)
    this.status = 401
    this.name = 'Unauthorized'
  }
}

module.exports = Unauthorized
