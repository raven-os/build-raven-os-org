const AbstractAction = require('../abstract')
const { param, body } = require('express-validator/check')

/**
 * @api {put} /api/build/:id/stderr [BUILDER ONLY] Write to the standard error
 * @apiVersion 1.0.0
 * @apiGroup Build
 * @apiName BuildStderr
 *
 * @apiDescription Append logs to the standard error
 *
 * @apiParam  (Params) {Integer}  id    ID of the build
 * @apiParam  (Body)   {String}   data  Content to append at the end of the standard error
 *
 * @apiParamExample {json} Request Body
 * {
 *    "data": "mv: cannot stat /path: No such file or directory...\n..."
 * }
 *
 * @apiSuccess  {Integer}                               id            ID of the build
 * @apiSuccess  {Integer[]}                             manifest_id   IDs of manifests to build
 * @apiSuccess  {Integer}                               [exit_status] Exit status code
 * @apiSuccess  {String}                                stdout        Content of the standard output
 * @apiSuccess  {String}                                stderr        Content of the standard error
 * @apiSuccess  {String}                                creation_date Date of creation
 * @apiSuccess  {String}                                [start_date]  Date when the build was started
 * @apiSuccess  {String}                                [end_date]    Date when the build ended
 * @apiSuccess  {String="queuing","running","finished"} state         State of the build
 * @apiSuccess  {String[]}                              packages      Link to packages built
 *
 * @apiSuccessExample {json} Response
 * {
 *    "id": 210,
 *    "manifest_id": [42, 101],
 *    "exit_status": null,
 *    "stdout": "checking build system...\n",
 *    "stderr": "mv: cannot stat /path: No such file or directory...\n...",
 *    "creation_date": "2019-07-19T22:25:10.370Z",
 *    "start_date": "2019-07-19T22:30:10.370Z",
 *    "end_date": null,
 *    "state": "running",
 *    "packages": []
 * }
 *
 * @apiError  {String}    message        Error message
 * @apiError  {Object[]}  errors         List of error details
 * @apiError  {String}    errors.param   The request parameter that caused the error
 * @apiError  {string}    errors.detail  Details about the parameter that caused the error
 * @apiError  {string}    errors.value   Value provided for the invalid parameter
 *
 * @apiErrorExample {json} Bad Request 400
 * {
 *    "message": "Validation failed",
 *    "errors": [
 *      {
 *          "param": "id",
 *          "detail": "must be an integer",
 *          "value": "bonjour"
 *      }
 *    ]
 * }
 *
 * @apiErrorExample {json} Not Found 404
 * {
 *    "message": "Build #4400 not found",
 *    "errors": []
 * }
 */
class UpdateBuildStderr extends AbstractAction {
  get validate () {
    return [
      param('id')
        .exists({ checkNull: true }).withMessage('required field')
        .isInt().withMessage('must be an integer'),
      body('data')
        .exists({ checkNull: true }).withMessage('required field')
        .isString().withMessage('must be a string')
    ]
  }

  async handler (req, res, next) {
    return this.app.controller.build.stderr(req.params.id, req.body.data)
  }
}

module.exports = UpdateBuildStderr
