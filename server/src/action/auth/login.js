const AbstractAction = require('../abstract')
const { body } = require('express-validator')

class Login extends AbstractAction {
  get validate () {
    return [
      body('email')
        .exists({ checkNull: true }).withMessage('required field')
        .trim()
        .isEmail().withMessage('must be an email')
        .normalizeEmail(),
      body('password')
        .exists({ checkNull: true }).withMessage('required field')
        .isString().withMessage('must be a string')
    ]
  }

  async handler (req, res, next) {
    const user = await this.app.controller.auth.login(req.body.email, req.body.password)

    req.session.user = user

    return user
  }
}

module.exports = Login
