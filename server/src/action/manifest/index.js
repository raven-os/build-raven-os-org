const CreateManifest = require('./create')
const UpdateManifest = require('./update')
const GetManifest = require('./get')
const ListManifest = require('./list')

class ManifestAction {
  constructor (app) {
    this.create = new CreateManifest(app)
    this.update = new UpdateManifest(app)
    this.get = new GetManifest(app)
    this.list = new ListManifest(app)
  }
}

module.exports = ManifestAction
