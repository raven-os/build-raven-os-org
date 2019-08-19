const ManifestAction = require('./manifest')
const BuildAction = require('./build')
const InvitationAction = require('./invitation')

class Action {
  constructor (app) {
    this.manifest = new ManifestAction(app)
    this.build = new BuildAction(app)
    this.invitation = new InvitationAction(app)
  }
}

module.exports = Action
