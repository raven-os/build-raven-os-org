const AbstractAction = require('../abstract')
const { param } = require('express-validator/check')

class GetBuild extends AbstractAction {
  get validate () {
    return [
      param('id')
        .exists({ checkNull: true }).withMessage('required field')
        .isInt().withMessage('must be an integer')
    ]
  }

  async handler (req, res, next) {
    return this.app.controller.build.get(req.params.id)
  }
}

module.exports = GetBuild
