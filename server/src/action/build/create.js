const AbstractAction = require('../abstract')
const { body } = require('express-validator/check')

/**
 * @api {post} /api/build Create
 * @apiVersion 1.0.0
 * @apiGroup Build
 * @apiName BuildCreate
 *
 * @apiDescription Create a new build and schedule it to compile some manifests
 *
 * @apiParam  (Body) {Integer[]}  ids    IDs of the manifests to build
 *
 * @apiParamExample {json} Request Body
 * {
 *    "ids": [42, 101]
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
 * @apiError  {String}    errors.param   The request parameter that caused the error
 * @apiError  {string}    errors.detail  Details about the parameter that caused the error
 * @apiError  {string}    errors.value   Value provided for the invalid parameter
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
