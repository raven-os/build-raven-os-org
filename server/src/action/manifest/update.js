const AbstractAction = require('../abstract')
const { body, param } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

/**
 * @api {put} /api/manifest/:id Update
 * @apiVersion 1.0.0
 * @apiGroup Manifest
 * @apiName ManifestUpdate
 *
 * @apiDescription Update a manifest
 *
 * @apiParam  (Params) {Integer}      id      ID of the manifest
 * @apiParam  (Body)   {String{1..}}  content New content of the manifest
 *
 * @apiParamExample {json} Request Body
 * {
 *    "content": "{{content of a python file manifest}}"
 * }
 *
 * @apiSuccess  {Integer}   id            ID of the content
 * @apiSuccess  {Integer}   manifest_id   ID of the manifest
 * @apiSuccess  {String}    content       The content of the manifest
 * @apiSuccess  {String}    edition_date  Date of content edition
 *
 * @apiSuccessExample {json} Response
 * {
 *    "id": 75,
 *    "manifest_id": 56,
 *    "content": "{{content of a build manifest (python)}}"
 *    "edition_date": "2019-07-19T22:25:10.370Z"
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
 *          "param": "content",
 *          "detail": "required field"
 *      }
 *    ]
 * }
 *
 * @apiErrorExample {json} Not Found 404
 * {
 *    "message": "Manifest #42 not found",
 *    "errors": []
 * }
 */
class UpdateManifest extends AbstractAction {
  get validate () {
    return [
      sanitizeBody('content').trim(),
      param('id')
        .exists({ checkNull: true }).withMessage('required field')
        .isInt().withMessage('must be an integer'),
      body('content')
        .exists({ checkNull: true }).withMessage('required field')
        .isString().withMessage('must be a string')
        .isLength({ min: 1 }).withMessage('length must be greater than 1')
    ]
  }

  async handler (req, res, next) {
    return this.app.controller.manifest.updateContent(req.params.id, req.body.content)
  }
}

module.exports = UpdateManifest
