const CreateBuild = require('./create')

class BuildAction {
  constructor (app) {
    this.create = new CreateBuild(app)
  }
}

module.exports = BuildAction
