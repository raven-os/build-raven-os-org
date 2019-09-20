const Login = require('./login')
const Logout = require('./logout')

class AuthAction {
  constructor (app) {
    this.login = new Login(app)
    this.logout = new Logout(app)
  }
}

module.exports = AuthAction
