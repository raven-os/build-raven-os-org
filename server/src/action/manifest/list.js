const AbstractAction = require('../abstract')
// const { param } = require('express-validator/check')
const controller = require('../../controller/manifest')

class ListManifest extends AbstractAction {
  get validate () {
    return []
  }

  async handler (req, res, next) {
    return controller.list()
  }
}

module.exports = ListManifest
