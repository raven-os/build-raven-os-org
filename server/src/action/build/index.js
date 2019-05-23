const AuthorizationBuild = require('./authorization')
const CreateBuild = require('./create')
const UpdateBuildStdout = require('./stdout')
const UpdateBuildStderr = require('./stderr')
const StartBuild = require('./start')
const EndBuild = require('./end')
const GetBuild = require('./get')
const ListBuild = require('./list')

class BuildAction {
  constructor (app) {
    this.authorization = new AuthorizationBuild(app)
    this.create = new CreateBuild(app)
    this.stdout = new UpdateBuildStdout(app)
    this.stderr = new UpdateBuildStderr(app)
    this.start = new StartBuild(app)
    this.end = new EndBuild(app)
    this.get = new GetBuild(app)
    this.list = new ListBuild(app)
  }
}

module.exports = BuildAction
