const CreateInvitation = require('./create')

class InvitationAction {
  constructor (app) {
    this.create = new CreateInvitation(app)
  }
}

module.exports = InvitationAction
