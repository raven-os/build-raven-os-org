const uuidv4 = require('uuid/v4')

class InvitationController {
  constructor (app) {
    this.app = app
  }

  async _get (uuid) {
    const invitationModel = await this.app.database.model.invitation
      .where('uuid', uuid)
      .fetch()

    if (!invitationModel) {
      throw new this.app.errors.NotFound(`Invitation #${uuid} not found`)
    }

    return invitationModel
  }

  async create (input) {
    const date = new Date()

    if (await this.app.controller.user.exists(input.email)) {
      throw new this.app.errors.BadRequest(`The email ${input.email} is already used`)
    }

    const invitation = await this.app.database.model.invitation.forge({
      uuid: uuidv4(),
      email: input.email,
      expire_after: input.expire_after,
      creation_date: date,
      used_date: null
    })
      .save()

    return invitation.toJSON()
  }

  async use (invitation, date) {
    await invitation.save({ used_date: date })
  }
}

module.exports = InvitationController
