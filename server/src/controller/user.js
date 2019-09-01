const { hashPassword } = require('./utils')

class UserController {
  constructor (app) {
    this.app = app
  }

  static get rights () {
    return {
      ADMIN: 'admin'
    }
  }

  async exists (email) {
    const count = await this.app.database.model.user
      .where('email', email)
      .count()

    return count === '1'
  }

  async create (input) {
    const _invitation = await this.app.controller.invitation._get(input.invitation)
    const invitation = _invitation.toJSON()
    const now = new Date()

    if (invitation.used_date) {
      throw new this.app.errors.BadRequest(`Invitation #${input.invitation} is already used`)
    }

    const expirationDate = new Date(invitation.creation_date)
    expirationDate.setMinutes(expirationDate.getMinutes() + invitation.expire_after)

    if (now > expirationDate) {
      throw new this.app.errors.BadRequest(`Invitation #${input.invitation} has expired`)
    }

    const user = await this.app.database.model.user.forge({
      firstname: input.firstname,
      lastname: input.lastname,
      email: invitation.email,
      password: await hashPassword(input.password),
      rights: invitation.rights,
      creation_date: now,
      last_access: null
    })
      .save()

    await this.app.controller.invitation.use(_invitation, now)

    return user.toJSON()
  }

  async _get ({ id, email }) {
    const filters = id ? ['id', id] : ['email', email]

    const userModel = await this.app.database.model.user
      .where(...filters)
      .fetch()

    if (!userModel) {
      throw new this.app.errors.NotFound(`User ${id ? '#' + id : email} not found`)
    }

    return userModel
  }

  async get ({ id, email }) {
    const user = await this._get({ id, email })

    return user.toJSON()
  }
}

module.exports = UserController
