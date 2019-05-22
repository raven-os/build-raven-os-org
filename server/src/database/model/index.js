const manifest = require('./manifest')
const manifestContent = require('./manifest_content')
const build = require('./build')

class Model {
  constructor (app) {
    this.manifest = manifest
    this.manifestContent = manifestContent
    this.build = build
  }
}

module.exports = Model
