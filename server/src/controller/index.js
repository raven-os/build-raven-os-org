const ManifestController = require('./manifest')
const BuildController = require('./build')
const UserController = require('./user')
const InvitationController = require('./invitation')
const AuthController = require('./auth')

class Controller {
  constructor (app) {
    this.manifest = new ManifestController(app)
    this.build = new BuildController(app)
    this.user = new UserController(app)
    this.invitation = new InvitationController(app)
    this.auth = new AuthController(app)
  }
}

module.exports = Controller
