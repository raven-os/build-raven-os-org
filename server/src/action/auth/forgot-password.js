const AbstractAction = require('../abstract')
const { body } = require('express-validator')

class ForgotPassword extends AbstractAction {
  get validate () {
    return [
      body('email')
        .exists({ checkNull: true }).withMessage('required field')
        .trim()
        .isEmail().withMessage('must be an email')
        .normalizeEmail()
    ]
  }

  async handler (req, res, next) {
    return this.app.controller.auth.forgotPassword(req.body.email)
  }
}

module.exports = ForgotPassword
