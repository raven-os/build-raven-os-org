const AbstractAction = require('../abstract')
const { body } = require('express-validator')
const UserController = require('../../controller/user')
const rights = Object.values(UserController.rights)
const arrayUnique = require('../sanitizer/array-unique')
const arrayEnum = require('../validator/array-enum')

/**
 * @api {post} /api/invite  Send Invitation
 * @apiVersion 1.0.0
 * @apiGroup Invitation
 * @apiName InvitationSend
 *
 * @apiPermission admin
 *
 * @apiDescription Send invitation email for a new user to sign up
 *
 * @apiHeader {String} Cookie Contains the session identifier `user_sid`
 *
 * @apiParam  (Body) {String}   email             Invited user email
 * @apiParam  (Body) {String[]} rights            Invited user rights
 * @apiParam  (Body) {Integer}  [expire_after=60] Invitation expiration time in minutes
 *
 * @apiParamExample {json} Request Body
 * {
 *    "email": "john.doe@gmail.com",
 *    "rights": ["admin"],
 *    "expire_after": 30
 * }
 *
 * @apiSuccess  {Integer}  id             ID of the invitation
 * @apiSuccess  {String}   email          Email of the user
 * @apiSuccess  {String}   rights         Rights of the user
 * @apiSuccess  {Integer}  expire_after   Expireation time in minutes
 * @apiSuccess  {String}   uuid           Invitation code
 * @apiSuccess  {String}   creation_date  Date of creation
 * @apiSuccess  {String}   [used_date]    Last access date
 *
 * @apiSuccessExample {json} Response
 * {
 *    "id": 42,
 *    "email": "john.doe@gmail.com",
 *    "rights": ["admin"],
 *    "expire_after": 30,
 *    "uuid": "36c4c9b1-ff06-46bc-b6c9-2fc72b8f5b2e",
 *    "creation_date": "2019-07-19T22:25:10.370Z",
 *    "used_date": null
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
 *    "message": "You must be connected",
 *    "errors": []
 * }
 *
 * @apiErrorExample {json} Bad Request 400
 * {
 *    "message": "The email john.doe@gmail.com is already used",
 *    "errors": []
 * }
 *
 * @apiErrorExample {json} Forbidden 403
 * {
 *    "message": "You don't have admin rights",
 *    "errors": []
 * }
 *
 */
class CreateInvitation extends AbstractAction {
  get validate () {
    return [
      body('email')
        .exists({ checkNull: true }).withMessage('required field')
        .trim()
        .isEmail().withMessage('must be an email')
        .normalizeEmail(),
      body('rights')
        .optional()
        .isArray().withMessage('must be an array')
        .toArray()
        .customSanitizer(arrayUnique)
        .custom(arrayEnum(rights)).withMessage(`allowed rights: [${rights.join(', ')}]`),
      body('expire_after')
        .optional()
        .isInt({ min: 10 }).withMessage('must be in integer, higher than 10')
        .toInt()
    ]
  }

  async handler (req, res, next) {
    const invitation = {
      email: req.body.email,
      rights: req.body.rights || [],
      expire_after: req.body.expire_after !== undefined ? req.body.expire_after : 60
    }

    return this.app.controller.invitation.create(invitation)
  }
}

module.exports = CreateInvitation
