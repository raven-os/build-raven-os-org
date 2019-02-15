const AbstractAction = require('../abstract')
const { body, param } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

class UpdateManifest extends AbstractAction {
  get validate () {
    return [
      sanitizeBody('content').trim(),
      param('id')
        .exists({ checkNull: true }).withMessage('required field')
        .isInt().withMessage('must be an integer'),
      body('content')
        .exists({ checkNull: true }).withMessage('required field')
        .isString().withMessage('must be a string')
        .isLength({ min: 1 }).withMessage('length must be greater than 1')
    ]
  }

  async handler (req, res, next) {
    return this.app.controller.manifest.updateContent(req.params.id, req.body.content)
  }
}

module.exports = UpdateManifest
