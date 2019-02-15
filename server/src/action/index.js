const ManifestAction = require('./manifest')
const BuildAction = require('./build')

class Action {
  constructor (app) {
    this.manifest = new ManifestAction(app)
    this.build = new BuildAction(app)
  }
}

module.exports = Action
