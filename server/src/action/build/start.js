const AbstractAction = require('../abstract')
const { param } = require('express-validator/check')

class StartBuild extends AbstractAction {
  get validate () {
    return [
      param('id')
        .exists({ checkNull: true }).withMessage('required field')
        .isInt().withMessage('must be an integer')
    ]
  }

  async handler (req, res, next) {
    return this.app.controller.build.start(req.params.id)
  }
}

module.exports = StartBuild
