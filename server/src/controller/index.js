const ManifestController = require('./manifest')
const BuildController = require('./build')
const UserController = require('./user')
const InvitationController = require('./invitation')

class Controller {
  constructor (app) {
    this.manifest = new ManifestController(app)
    this.build = new BuildController(app)
    this.user = new UserController(app)
    this.invitation = new InvitationController(app)
  }
}

module.exports = Controller
