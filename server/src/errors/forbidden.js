const CustomError = require('./custom-error')

class Forbidden extends CustomError {
  constructor (message, ...args) {
    super(message || 'Forbidden', ...args)
    this.status = 403
    this.name = 'Forbidden'
  }
}

module.exports = Forbidden
