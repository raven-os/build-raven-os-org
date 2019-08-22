const uuidv4 = require('uuid/v4')

class InvitationController {
  constructor (app) {
    this.app = app
  }

  async create (input) {
    const date = new Date()

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
}

module.exports = InvitationController
