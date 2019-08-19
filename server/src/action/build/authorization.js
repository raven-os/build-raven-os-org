const AbstractAction = require('../abstract')
const { header } = require('express-validator')

class AuthorizationBuild extends AbstractAction {
  constructor (app) {
    super(app)
    this.routes = [
      this.validate,
      this._middlewareHandler,
      this.handler.bind(this)
    ]
  }

  get validate () {
    return [
      header('authorization')
        .exists({ checkNull: true }).withMessage('required field')
    ]
  }

  handler (req, res, next) {
    this.app.controller.build.authorization(req.headers.authorization)
    next()
  }
}

module.exports = AuthorizationBuild
