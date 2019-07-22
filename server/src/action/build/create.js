const AbstractAction = require('../abstract')
const { body } = require('express-validator/check')

/**
 * @api {post} /api/build Create
 * @apiVersion 1.0.0
 * @apiGroup Build
 * @apiName BuildCreate
 *
 * @apiDescription Create and schedule a build
 *
 * @apiParam  (Body) {Integer[]}  ids    Ids of manifests to build
 *
 * @apiParamExample {json} Request Body
 * {
 *    "ids": [42, 101]
 * }
 *
 * @apiSuccess  {Integer}                               id            Id of the build
 * @apiSuccess  {Integer[]}                             manifest_id   Ids of manifests to build
 * @apiSuccess  {Integer}                               [exit_status] Exit status code
 * @apiSuccess  {String}                                stdout        Logs from stdout
 * @apiSuccess  {String}                                stderr        Errors logged on stderr
 * @apiSuccess  {String}                                creation_date Date of creation
 * @apiSuccess  {String}                                [start_date]  Date when the build was started
 * @apiSuccess  {String}                                [end_date]    Date when the build ended
 * @apiSuccess  {String="queuing","running","finished"} state         State of the build
 * *
 * @apiSuccessExample {json} Response
 * {
 *    "id": 210,
 *    "manifest_id": [42, 101],
 *    "exit_status": null,
 *    "stdout": "",
 *    "stderr": "",
 *    "creation_date": "2019-07-19T22:25:10.370Z",
 *    "start_date": null,
 *    "end_date": null,
 *    "state": "queuing"
 * }
 *
 * @apiError  {String}    message        Error message
 * @apiError  {Object[]}  errors         List of error details
 * @apiError  {String}    errors.param   Request parameter in error
 * @apiError  {string}    errors.detail  Detail about the parameter in error
 * @apiError  {string}    errors.value   Value of the parameter provided
 *
 * @apiErrorExample {json} Bad Request 400
 * {
 *    "message": "Validation failed",
 *    "errors": [
 *      {
 *          "param": "ids",
 *          "detail": "must be an array of ids",
 *          "value": "bonjour"
 *      }
 *    ]
 * }
 *
 * @apiErrorExample {json} Not Found 404
 * {
 *    "message": "Manifest #4400 not found",
 *    "errors": []
 * }
 */
class CreateBuild extends AbstractAction {
  get validate () {
    return [
      body('ids')
        .exists({ checkNull: true }).withMessage('required field')
        .isArray().withMessage('must be an array of ids')
    ]
  }

  async handler (req, res, next) {
    return this.app.controller.build.create(req.body.ids)
  }
}

module.exports = CreateBuild
