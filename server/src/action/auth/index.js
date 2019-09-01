const Login = require('./login')

class AuthAction {
  constructor (app) {
    this.login = new Login(app)
  }
}

module.exports = AuthAction
