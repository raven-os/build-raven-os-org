const AbstractAction = require('../abstract')

class ListManifest extends AbstractAction {
  get validate () {
    return []
  }

  async handler (req, res, next) {
    return this.app.controller.manifest.list()
  }
}

module.exports = ListManifest
