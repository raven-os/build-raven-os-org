const NotFound = require('./not-found')
const Forbidden = require('./forbidden')

class Errors {
  constructor (app) {
    this.NotFound = NotFound
    this.Forbidden = Forbidden
  }
}

module.exports = Errors
