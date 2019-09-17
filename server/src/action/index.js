const ManifestAction = require('./manifest')
const BuildAction = require('./build')
const UserAction = require('./user')
const InvitationAction = require('./invitation')
const AuthAction = require('./auth')

class Action {
  constructor (app) {
    this.manifest = new ManifestAction(app)
    this.build = new BuildAction(app)
    this.user = new UserAction(app)
    this.invitation = new InvitationAction(app)
    this.auth = new AuthAction(app)
  }
}

module.exports = Action
