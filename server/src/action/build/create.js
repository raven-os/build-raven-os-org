const AbstractAction = require('../abstract')
const { param } = require('express-validator/check')
const controller = require('../../controller/build')

class CreateBuild extends AbstractAction {
  // TODO: body param array of id
  get validate () {
    return [
      param('id')
        .exists({ checkNull: true }).withMessage('required field')
        .isInt().withMessage('must be an integer')
    ]
  }

  async handler (req, res, next) {
    return controller.create(req.params.id)
  }
}

module.exports = CreateBuild