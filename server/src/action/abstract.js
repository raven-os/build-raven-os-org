const { validationResult } = require('express-validator/check')

class AbstractAction {
  constructor () {
    this.routes = [
      this.validate,
      this._handler.bind(this)
    ]
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
}

module.exports = AbstractAction