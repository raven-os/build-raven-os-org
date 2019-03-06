const ManifestController = require('./manifest')
const BuildController = require('./build')

class Controller {
  constructor (app) {
    this.manifest = new ManifestController(app)
    this.build = new BuildController(app)
  }
}

module.exports = Controller
