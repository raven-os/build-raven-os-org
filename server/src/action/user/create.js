const AbstractAction = require('../abstract')
const { body } = require('express-validator')
const capitalize = require('../sanitizer/capitalize')
const uppercase = require('../sanitizer/uppercase')
const PasswordValidator = require('password-validator')
const commonPassword = require('common-password')

const schema = new PasswordValidator()

schema
  .has().uppercase()
  .has().lowercase()
  .has().digits()

class CreateUser extends AbstractAction {
  get validate () {
    return [
      body('invitation')
        .exists({ checkNull: true }).withMessage('required field')
        .isString().withMessage('must be a string')
        .trim(),
      body('firstname')
        .exists({ checkNull: true }).withMessage('required field')
        .isString().withMessage('must be a string')
        .trim()
        .isLength({ min: 1, max: 255 }).withMessage('length must be between 1 and 255')
        .customSanitizer(capitalize),
      body('lastname')
        .exists({ checkNull: true }).withMessage('required field')
        .isString().withMessage('must be a string')
        .trim()
        .isLength({ min: 1 }).withMessage('length must be greater than 1')
        .customSanitizer(uppercase),
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
    const user = {
      invitation: req.body.invitation,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password
    }

    return this.app.controller.user.create(user)
  }
}

module.exports = CreateUser
