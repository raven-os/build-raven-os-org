const AbstractAction = require('../abstract')
const { query } = require('express-validator')

/**
 * @api {get} /api/user List
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiName UserList
 *
 * @apiDescription List and search user by firstname, lastname or email
 *
 * @apiHeader {String} Cookie Contains the session identifier `user_sid`
 *
 * @apiParam  (Query String) {String} [search] Search for users with a `firstname` or `lastname` or `email` starting with `search`
 *
 * @apiSuccess  {Object[]}  data            List of users
 * @apiSuccess  {Integer}   id              ID of the user
 * @apiSuccess  {String}    firstname       Firstname of the user
 * @apiSuccess  {String}    lastname        Lastname of the user
 * @apiSuccess  {String}    email           Email of the user
 * @apiSuccess  {String[]}  rights          Rights of the user
 * @apiSuccess  {String}    creation_date   Date of creation
 * @apiSuccess  {String}    [last_access]   Last access date
 *
 * @apiSuccessExample {json} Response
 * [{
 *    "id": 42,
 *    "firstname": "John",
 *    "lastname": "DOE",
 *    "email": "john.doe@gmail.com",
 *    "rights": ["admin"],
 *    "creation_date": "2019-07-19T22:25:10.370Z",
 *    "last_access": null
 * },
 * ...
 * ]
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
 */
class ListUser extends AbstractAction {
  get validate () {
    return [
      query('search')
        .optional()
        .isString().withMessage('must be a string')
        .trim()
    ]
  }

  async handler (req, res, next) {
    return this.app.controller.user.list(req.query.search || '')
  }
}

module.exports = ListUser
