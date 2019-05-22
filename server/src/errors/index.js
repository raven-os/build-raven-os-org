const NotFound = require('./not-found')

class Errors {
  constructor (app) {
    this.NotFound = NotFound
  }
}

module.exports = Errors
