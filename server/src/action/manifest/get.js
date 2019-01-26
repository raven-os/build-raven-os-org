const AbstractAction = require('../abstract')
const { param } = require('express-validator/check')
const controller = require('../../controller/manifest')

class GetManifest extends AbstractAction {
  get validate () {
    return [
      param('id')
        .exists({ checkNull: true }).withMessage('required field')
        .isInt().withMessage('must be a integer')
    ]
  }

  async handler (req, res, next) {
    return controller.get(req.params.id)
  }
}

module.exports = GetManifest
