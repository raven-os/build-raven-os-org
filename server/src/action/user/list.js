const AbstractAction = require('../abstract')
const { query } = require('express-validator')

class ListUser extends AbstractAction {
  get validate () {
    return [
      query('search')
        .optional()
        .isString().withMessage('must be a string')
        .trim()
    ]
  }

  async handler (req, res, next) {
    return this.app.controller.user.list(req.query.search || '')
  }
}

module.exports = ListUser
