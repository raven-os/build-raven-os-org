const AbstractAction = require('../abstract')
const { body } = require('express-validator/check')

class CreateBuild extends AbstractAction {
  get validate () {
    return [
      body('ids')
        .exists({ checkNull: true }).withMessage('required field')
        .isArray().withMessage('must be an array of ids')
    ]
  }

  async handler (req, res, next) {
    return this.app.controller.build.create(req.body.ids)
  }
}

module.exports = CreateBuild
