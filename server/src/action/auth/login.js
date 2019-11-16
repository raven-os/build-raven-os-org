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

    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      rights: user.rights,
      creation_date: user.creation_date,
      last_access: user.last_access
    }
  }
}

module.exports = Login
