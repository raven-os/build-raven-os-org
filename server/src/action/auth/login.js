const AbstractAction = require('../abstract')
const { body } = require('express-validator')

/**
 * @api {post} /api/auth/login  Login
 * @apiVersion 1.0.0
 * @apiGroup Auth
 * @apiName AuthLogin
 *
 * @apiDescription Login
 *
 * @apiParam  (Body) {String}  email     User email
 * @apiParam  (Body) {String}  password  Password
 *
 * @apiParamExample {json} Request Body
 * {
 *    "email": "john.doe@gmail.com",
 *    "password": "$tR0nG_p4$$w0rd!"
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
 * @apiErrorExample {json} Bad Request 400
 * {
 *    "message": "Wrong password",
 *    "errors": []
 * }
 *
 */
class Login extends AbstractAction {
  get validate () {
    return [
      body('email')
        .exists({ checkNull: true }).withMessage('required field')
        .trim()
        .isEmail().withMessage('must be an email')
        .normalizeEmail(),
      body('password')
        .exists({ checkNull: true }).withMessage('required field')
        .isString().withMessage('must be a string')
    ]
  }

  async handler (req, res, next) {
    const user = await this.app.controller.auth.login(req.body.email, req.body.password)

    req.session.user = user

    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      rights: user.rights,
      creation_date: user.creation_date,
      last_access: user.last_access
    }
  }
}

module.exports = Login
