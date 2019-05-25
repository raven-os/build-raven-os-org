const { validationResult } = require('express-validator/check')

class AbstractAction {
  constructor (app) {
    this.app = app
    this.routes = [
      this.validate,
      this._handler.bind(this)
    ]

    this.DEFAULT_ITEM_PER_PAGE = 15
  }

  get validate () {
    return []
  }

  async handler (req) {
    return {}
  }

  async _handler (req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        errors.throw()
      }

      const result = await this.handler(req)
      return res.json(result || {})
    } catch (err) {
      next(err)
    }
  }

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
