const AbstractAction = require('../abstract')
const { param, body } = require('express-validator/check')

class UpdateBuildPackages extends AbstractAction {
  get validate () {
    return [
      param('id')
        .exists({ checkNull: true }).withMessage('required field')
        .isInt().withMessage('must be an integer'),
      body('data')
        .exists({ checkNull: true }).withMessage('required field')
        .isArray().withMessage('must be an array')
    ]
  }

  async handler (req, res, next) {
    return this.app.controller.build.packages(req.params.id, req.body.data)
  }
}

module.exports = UpdateBuildPackages
