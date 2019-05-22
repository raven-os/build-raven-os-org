const AbstractAction = require('../abstract')

class ListBuild extends AbstractAction {
  get validate () {
    return []
  }

  async handler (req, res, next) {
    return this.app.controller.build.list()
  }
}

module.exports = ListBuild
