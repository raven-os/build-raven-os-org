const AbstractAction = require('../abstract')
const { param, body } = require('express-validator/check')

class EndBuild extends AbstractAction {
  get validate () {
    return [
      param('id')
        .exists({ checkNull: true }).withMessage('required field')
        .isInt().withMessage('must be an integer'),
      body('exit_status')
        .exists({ checkNull: true }).withMessage('required field')
        .isInt().withMessage('must be an integer')
    ]
  }

  async handler (req, res, next) {
    return this.app.controller.build.end(req.params.id, req.body.exit_status)
  }
}

module.exports = EndBuild
