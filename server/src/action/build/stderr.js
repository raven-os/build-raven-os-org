const AbstractAction = require('../abstract')
const { param, body } = require('express-validator/check')

class UpdateBuildStderr extends AbstractAction {
  get validate () {
    return [
      param('id')
        .exists({ checkNull: true }).withMessage('required field')
        .isInt().withMessage('must be an integer'),
      body('data')
        .exists({ checkNull: true }).withMessage('required field')
        .isString().withMessage('must be a string')
    ]
  }

  async handler (req, res, next) {
    return this.app.controller.build.stderr(req.params.id, req.body.data)
  }
}

module.exports = UpdateBuildStderr
