const ManifestAction = require('./manifest')
const BuildAction = require('./build')
const UserAction = require('./user')
const InvitationAction = require('./invitation')

class Action {
  constructor (app) {
    this.manifest = new ManifestAction(app)
    this.build = new BuildAction(app)
    this.user = new UserAction(app)
    this.invitation = new InvitationAction(app)
  }
}

module.exports = Action
