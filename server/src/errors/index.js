const NotFound = require('./not-found')
const Forbidden = require('./forbidden')
const BadRequest = require('./bad-request')
const InternalServerError = require('./internal-server-error')

class Errors {
  constructor (app) {
    this.NotFound = NotFound
    this.Forbidden = Forbidden
    this.BadRequest = BadRequest
    this.InternalServerError = InternalServerError
  }
}

module.exports = Errors
