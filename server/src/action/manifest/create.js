const AbstractAction = require('../abstract')
const { body } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

class CreateManifest extends AbstractAction {
  get validate () {
    return [
      sanitizeBody('name').trim(),
      sanitizeBody('content').trim(),
      body('name')
        .exists({ checkNull: true }).withMessage('required field')
        .isString().withMessage('must be a string')
        .isLength({ min: 1, max: 255 }).withMessage('length must be between 1 and 255'),
      body('content')
        .exists({ checkNull: true }).withMessage('required field')
        .isString().withMessage('must be a string')
        .isLength({ min: 1 }).withMessage('length must be greater than 1')
    ]
  }

  async handler (req, res, next) {
    return this.app.controller.manifest.create(req.body.name, req.body.content)
  }
}

module.exports = CreateManifest
