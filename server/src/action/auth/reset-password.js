const AbstractAction = require('../abstract')
const { body } = require('express-validator')
const PasswordValidator = require('password-validator')
const commonPassword = require('common-password')

const schema = new PasswordValidator()

schema
  .has().uppercase()
  .has().lowercase()
  .has().digits()

class ResetPassword extends AbstractAction {
  get validate () {
    return [
      body('token')
        .exists({ checkNull: true }).withMessage('required field')
        .trim(),
      body('password', 'must have between 8 and 72 characters, contains at least 1 uppercase, 1 lowercase, 1 digit and not be common')
        .exists({ checkNull: true }).withMessage('required field')
        .isString().withMessage('must be a string')
        .isLength({ min: 8, max: 72 })
        .custom(value => {
          return schema.validate(value) && !commonPassword(value)
        })
    ]
  }

  async handler (req, res, next) {
    return this.app.controller.auth.resetPassword(req.body.token, req.body.password)
  }
}

module.exports = ResetPassword
