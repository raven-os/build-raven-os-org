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
    const users = await this.app.controller.user.list(req.query.search || '')

    for (let user of users) {
      delete user.password
    }

    return users
  }
}

module.exports = ListUser
