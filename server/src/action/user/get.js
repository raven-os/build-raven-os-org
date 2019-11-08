const AbstractAction = require('../abstract')
const { param } = require('express-validator')

class GetUser extends AbstractAction {
  get validate () {
    return [
      param('id')
        .exists({ checkNull: true }).withMessage('required field')
        .isInt().withMessage('must be an integer')
        .toInt()
    ]
  }

  async handler (req, res, next) {
    const user = await this.app.controller.user.get({ id: req.params.id })

    delete user.password

    return user
  }
}

module.exports = GetUser
