const NotFound = require('./not-found')
const Forbidden = require('./forbidden')
const BadRequest = require('./bad-request')

class Errors {
  constructor (app) {
    this.NotFound = NotFound
    this.Forbidden = Forbidden
    this.BadRequest = BadRequest
  }
}

module.exports = Errors
