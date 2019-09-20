const NotFound = require('./not-found')
const Forbidden = require('./forbidden')
const BadRequest = require('./bad-request')
const InternalServerError = require('./internal-server-error')
const Unauthorized = require('./unauthorized')

class Errors {
  constructor (app) {
    this.NotFound = NotFound
    this.Forbidden = Forbidden
    this.BadRequest = BadRequest
    this.InternalServerError = InternalServerError
    this.Unauthorized = Unauthorized
  }
}

module.exports = Errors
