const AbstractAction = require('../abstract')
const { body, param } = require('express-validator/check')
const controller = require('../../controller/manifest')

class UpdateManifest extends AbstractAction {
  get validate () {
    return [
      param('id')
        .exists({ checkNull: true }).withMessage('required field')
        .isInt().withMessage('must be a integer'),
      body('content')
        .exists({ checkNull: true }).withMessage('required field')
        .isString().withMessage('must be a string')
        .isLength({ min: 1 }).withMessage('length must be more than 1')
    ]
  }

  async handler (req, res, next) {
    return controller.updateContent(req.params.id, req.body.content)
  }
}

module.exports = UpdateManifest
