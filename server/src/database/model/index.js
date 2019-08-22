const manifest = require('./manifest')
const manifestContent = require('./manifest_content')
const build = require('./build')
const user = require('./user')
const invitation = require('./invitation')

class Model {
  constructor (app) {
    this.manifest = manifest
    this.manifestContent = manifestContent
    this.build = build
    this.user = user
    this.invitation = invitation
  }
}

module.exports = Model
