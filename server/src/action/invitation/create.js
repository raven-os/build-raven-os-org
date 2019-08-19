const AbstractAction = require('../abstract')
const { body } = require('express-validator')
const UserController = require('../../controller/user')
const rights = Object.values(UserController.rights)
const arrayUnique = require('../sanitizer/array-unique')
const arrayEnum = require('../validator/array-enum')

class CreateInvitation extends AbstractAction {
  get validate () {
    return [
      body('email')
        .exists({ checkNull: true }).withMessage('required field')
        .trim()
        .isEmail().withMessage('must be an email')
        .normalizeEmail(),
      body('rights')
        .optional()
        .isArray().withMessage('must be an array')
        .toArray()
        .customSanitizer(arrayUnique)
        .custom(arrayEnum(rights)).withMessage(`allowed rights: [${rights.join(', ')}]`),
      body('expire_after')
        .optional()
        .isInt({ min: 10 }).withMessage('must be in integer, higher than 10')
        .toInt()
    ]
  }

  async handler (req, res, next) {
    const invitation = {
      email: req.body.email,
      rights: req.body.rights || [],
      expire_after: req.body.expire_after !== undefined ? req.body.expire_after : 60
    }

    return this.app.controller.invitation.create(invitation)
  }
}

module.exports = CreateInvitation
