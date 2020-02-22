const AbstractAction = require('../abstract')
const { body } = require('express-validator')

/**
 * @api {post} /api/auth/forgot  Forgot Password
 * @apiVersion 1.0.0
 * @apiGroup Auth
 * @apiName AuthForgot
 *
 * @apiDescription Send an email with a code to reset the password
 *
 * @apiParam  (Body) {String}  email     User email
 *
 * @apiParamExample {json} Request Body
 * {
 *    "email": "john.doe@gmail.com",
 * }
 *
 * @apiSuccessExample {json} Response
 * {}
 *
 * @apiError  {String}    message        Error message
 * @apiError  {Object[]}  errors         List of error details
 * @apiError  {String}    errors.param   The request parameter that caused the error
 * @apiError  {string}    errors.detail  Details about the parameter that caused the error
 * @apiError  {string}    errors.value   Value provided for the invalid parameter
 *
 * @apiErrorExample {json} Unauthorized 401
 * {
 *    "message": "You are already connected",
 *    "errors": []
 * }
 *
 * @apiErrorExample {json} Not Found 404
 * {
 *    "message": "No user with email john.doe@gmail.com",
 *    "errors": []
 * }
 *
 */
class ForgotPassword extends AbstractAction {
  get validate () {
    return [
      body('email')
        .exists({ checkNull: true }).withMessage('required field')
        .trim()
        .isEmail().withMessage('must be an email')
        .normalizeEmail()
    ]
  }

  async handler (req, res, next) {
    return this.app.controller.auth.forgotPassword(req.body.email)
  }
}

module.exports = ForgotPassword
