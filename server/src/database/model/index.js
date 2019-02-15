const manifest = require('./manifest')
const manifestContent = require('./manifest_content')

class Model {
  constructor (app) {
    this.manifest = manifest
    this.manifestContent = manifestContent
  }
}

module.exports = Model
