const AbstractAction = require('../abstract')
const { param } = require('express-validator')

/**
 * @api {get} /api/user/:id  Get
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiName UserGet
 *
 * @apiDescription Fetch a user
 *
 * @apiHeader {String} Cookie Contains the session identifier `user_sid`
 *
 * @apiParam  (Params) {Integer}  id  ID of the user
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
 *    "message": "You must be connected",
 *    "errors": []
 * }
 *
 * @apiErrorExample {json} Not Found 404
 * {
 *    "message": "User #90 not found",
 *    "errors": []
 * }
 *
 */
class GetUser extends AbstractAction {
  get validate () {
    return [
      param('id')
        .exists({ checkNull: true }).withMessage('required field')
        .isInt().withMessage('must be an integer')
        .toInt()
    ]
  }

  async handler (req, res, next) {
    const user = await this.app.controller.user.get({ id: req.params.id })

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

module.exports = GetUser
