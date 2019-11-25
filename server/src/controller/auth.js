const { comparePassword, generateToken } = require('./utils')

class AuthController {
  constructor (app) {
    this.app = app

    this.recovery = {}
    this.recoveryTimeout = 10 // minutes
  }

  async login (email, password) {
    if (!await this.app.controller.user.exists(email)) {
      throw new this.app.errors.BadRequest(`No user with email ${email}`)
    }

    const user = await this.app.controller.user.get({ email })

    await comparePassword(password, user.password)

    return user
  }

  async forgotPassword (email) {
    if (!await this.app.controller.user.exists(email)) {
      throw new this.app.errors.NotFound(`No user with email ${email}`)
    }

    const token = await generateToken()
    const date = new Date()
    date.setMinutes(date.getMinutes() + this.recoveryTimeout)

    this.recovery[email] = { token, expireAt: date }

    const subject = `Password recovery for Raven's Package Builder`
    const text = `To reset your password on Raven's Package Builder, use this code: ${token}`

    await this.app.mailer.send(email, subject, text)
  }

  async resetPassword (token, password) {
    const recovery = Object.entries(this.recovery).filter(e => e[1] && e[1].token === token)

    if (recovery.length !== 1) {
      throw new this.app.errors.NotFound(`Token ${token} not found. Ask for another token`)
    }

    const email = recovery[0][0]
    const { expireAt } = recovery[0][1]
    const now = new Date()

    if (now > expireAt) {
      throw new this.app.errors.Forbidden(`Token ${token} has expired`)
    }

    await this.app.controller.user.resetPassword(email, password)
  }
}

module.exports = AuthController
