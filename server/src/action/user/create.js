const AbstractAction = require('../abstract')
const { body } = require('express-validator')
const capitalize = require('../sanitizer/capitalize')
const uppercase = require('../sanitizer/uppercase')
const PasswordValidator = require('password-validator')
const commonPassword = require('common-password')

/**
 * @api {post} /api/user  Create
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiName UserCreate
 *
 * @apiDescription Create a new user
 *
 * @apiParam  (Body) {String}  invitation Invitation code received by email
 * @apiParam  (Body) {String}  firstname  User firstname
 * @apiParam  (Body) {String}  lastname   User lastname
 * @apiParam  (Body) {String}  password   User password
 *
 * @apiParamExample {json} Request Body
 * {
 *    "invitation": "a13f3c78-eca9-440f-8621-123909a83427",
 *    "firstname": "john",
 *    "lastname": "doe",
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
 * @apiErrorExample {json} Not Found 404
 * {
 *    "message": "Invitation #hello not found",
 *    "errors": []
 * }
 *
 */
const schema = new PasswordValidator()

schema
  .has().uppercase()
  .has().lowercase()
  .has().digits()

class CreateUser extends AbstractAction {
  get validate () {
    return [
      body('invitation')
        .exists({ checkNull: true }).withMessage('required field')
        .isString().withMessage('must be a string')
        .trim(),
      body('firstname')
        .exists({ checkNull: true }).withMessage('required field')
        .isString().withMessage('must be a string')
        .trim()
        .isLength({ min: 1, max: 255 }).withMessage('length must be between 1 and 255')
        .customSanitizer(capitalize),
      body('lastname')
        .exists({ checkNull: true }).withMessage('required field')
        .isString().withMessage('must be a string')
        .trim()
        .isLength({ min: 1 }).withMessage('length must be greater than 1')
        .customSanitizer(uppercase),
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
    const input = {
      invitation: req.body.invitation,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password
    }

    const user = await this.app.controller.user.create(input)

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

module.exports = CreateUser
