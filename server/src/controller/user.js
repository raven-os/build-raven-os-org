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

  async exists (value, field = 'email') {
    const count = await this.app.database.model.user
      .where(field, value)
      .count()

    console.log(count, field, value)
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

  async resetPassword (email, password) {
    const user = await this._get({ email })

    await user
      .save({ password: await hashPassword(password) }, { patch: true })
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

  async list (search) {
    const users = await this.app.database.model.user
      .query(qb => {
        qb.where('firstname', 'LIKE', search + '%')
          .orWhere('lastname', 'LIKE', search + '%')
          .orWhere('email', 'LIKE', search + '%')
      })
      .fetchAll({
        columns: ['id', 'firstname', 'lastname', 'email', 'rights', 'creation_date', 'last_access']
      })

    return users.toJSON()
  }
}

module.exports = UserController
