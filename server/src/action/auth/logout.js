const AbstractAction = require('../abstract')

/**
 * @api {delete} /api/auth/logout  Logout
 * @apiVersion 1.0.0
 * @apiGroup Auth
 * @apiName AuthLogout
 *
 * @apiDescription Logout and delete the session cookie
 *
 * @apiHeader {String} Cookie Contains the session identifier `user_sid`
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
 *    "message": "You must be connected",
 *    "errors": []
 * }
 *
 */
class Logout extends AbstractAction {
  async handler (req, res) {
    res.clearCookie('user_sid')
    req.session.destroy((err) => {
      if (err) {
        console.error('[logout.err]', err)
      } else {
      }
    })

    return {}
  }
}

module.exports = Logout
