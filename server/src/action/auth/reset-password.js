const AbstractAction = require('../abstract')
const { body } = require('express-validator')
const PasswordValidator = require('password-validator')
const commonPassword = require('common-password')

/**
 * @api {put} /api/auth/reset  Reset Password
 * @apiVersion 1.0.0
 * @apiGroup Auth
 * @apiName AuthReset
 *
 * @apiDescription Reset the password
 *
 * @apiParam  (Body) {String}  token     Code to reset the password
 * @apiParam  (Body) {String}  password  New password
 *
 * @apiParamExample {json} Request Body
 * {
 *    "token": "028070d88b6957eeb687ff97a6b45196a1312101",
 *    "password": "$tR0nG3R_p4$$w0rd!"
 * }
 *
 * @apiSuccess  {Integer}   id              ID of the user
 * @apiSuccess  {String}    firstname       Firstname of the user
 * @apiSuccess  {String}    lastname        Lastname of the user
 * @apiSuccess  {String}    email           Email of the user
 * @apiSuccess  {String[]}  rights          Rights of the user
 * @apiSuccess  {String}    creation_date   Date of creation
 * @apiSuccess  {String}    [last_access]   Last access date
 *
 * @apiSuccessExample {json} Response
 * {
 *    "id": 42,
 *    "firstname": "John",
 *    "lastname": "DOE",
 *    "email": "john.doe@gmail.com",
 *    "rights": ["admin"],
 *    "creation_date": "2019-07-19T22:25:10.370Z",
 *    "last_access": null
 * }
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
 *    "message": "Token abc not found. Ask for another token",
 *    "errors": []
 * }
 *
 * @apiErrorExample {json} Bad Request 400
 * {
 *    "message": "password: must have between 8 and 72 characters, contains at least 1 uppercase, 1 lowercase, 1 digit and not be common",
 *    "errors": []
 * }
 *
 */
const schema = new PasswordValidator()

schema
  .has().uppercase()
  .has().lowercase()
  .has().digits()

class ResetPassword extends AbstractAction {
  get validate () {
    return [
      body('token')
        .exists({ checkNull: true }).withMessage('required field')
        .trim(),
      body('password', 'must have between 8 and 72 characters, contains at least 1 uppercase, 1 lowercase, 1 digit and not be common')
        .exists({ checkNull: true }).withMessage('required field')
        .isString().withMessage('must be a string')
        .isLength({ min: 8, max: 72 })
        .custom(value => {
          return schema.validate(value) && !commonPassword(value)
        })
    ]
  }

  async handler (req, res, next) {
    return this.app.controller.auth.resetPassword(req.body.token, req.body.password)
  }
}

module.exports = ResetPassword
