const { comparePassword } = require('./utils')

class AuthController {
  constructor (app) {
    this.app = app
  }

  async login (email, password) {
    if (!await this.app.controller.user.exists(email)) {
      throw new this.app.errors.BadRequest(`No user with email ${email}`)
    }

    const user = await this.app.controller.user.get({ email })

    await comparePassword(password, user.password)

    return user
  }
}

module.exports = AuthController
