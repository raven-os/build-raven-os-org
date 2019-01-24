const AbstractAction = require('../abstract')
const { body } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')
const controller = require('../../controller/manifest')

class CreateManifest extends AbstractAction {
  get validate () {
    return [
      sanitizeBody('name').trim(),
      body('name')
        .exists({ checkNull: true })
        .withMessage('name is required')
        .isString()
        .withMessage('name must be a string')
        .isLength({ min: 1, max: 255 })
        .withMessage('name must be between 1 and 255 characters')
    ]
  }

  async handler (req, res, next) {
    return controller.create(req.body.name)
  }
}

module.exports = CreateManifest
