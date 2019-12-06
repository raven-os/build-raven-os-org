const { validationResult } = require('express-validator')

/**
 * Abstract Action contains default behavior for handling requests and responses
 *
 * @public
 * @class
 */
class AbstractAction {
  constructor (app) {
    this.app = app
    this.routes = [
      this.validate,
      this._handler.bind(this)
    ]

    this.DEFAULT_ITEM_PER_PAGE = this.app.config.pagination.default_item_per_page
  }

  /**
   * List of validators to sanitize and validate user input
   *
   * @return {List} List of validators
   */
  get validate () {
    return []
  }

  /**
   * Handles the request
   *
   * @param  {Request}  req The incoming request
   * @return {Object}       The json response
   */
  async handler (req) {
    return {}
  }

  /**
   * Validates the input and calls the request handler
   * Then send the json response back to the client
   *
   * @param  {Request}    req  The incoming request
   * @param  {Response}   res  The outgoing response
   * @param  {Function}   next The next route
   * @throws {BadRequest}      If the input is invalid or the handler throws
   */
  async _handler (req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        errors.throw()
      }

      const result = await this.handler(req, res)
      return res.json(result || {})
    } catch (err) {
      next(err)
    }
  }

  /**
   * Validates the input and calls the next middleware
   *
   * @param  {Request}    req  The incoming request
   * @param  {Response}   res  The outgoing response
   * @param  {Function}   next The next route
   * @throws {BadRequest}      If the input is invalid
   */
  _middlewareHandler (req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        errors.throw()
      }

      return next()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = AbstractAction
