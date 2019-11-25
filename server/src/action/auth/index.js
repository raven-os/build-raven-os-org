const Login = require('./login')
const Logout = require('./logout')
const ForgotPassword = require('./forgot-password')
const ResetPassword = require('./reset-password')

class AuthAction {
  constructor (app) {
    this.login = new Login(app)
    this.logout = new Logout(app)
    this.forgotPassword = new ForgotPassword(app)
    this.resetPassword = new ResetPassword(app)
  }
}

module.exports = AuthAction
