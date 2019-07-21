const AbstractAction = require('../abstract')
const { param } = require('express-validator/check')

/**
 * @api {get} /api/manifest/:id Get
 * @apiVersion 1.0.0
 * @apiGroup Manifest
 * @apiName ManifestGet
 *
 * @apiDescription Retrieve a manifest
 *
 * @apiParam  (Params) {Integer}  id  Id of the manifest
 *
 * @apiSuccess  {Integer}   id                    Id of the manifest
 * @apiSuccess  {String}    name                  Name of the manifest
 * @apiSuccess  {String}    creation_date         Date of creation
 * @apiSuccess  {String}    last_update           Date of last update
 * @apiSuccess  {Object[]}  history               List of content (last updated first)
 * @apiSuccess  {Integer}   history.id            Id of the content
 * @apiSuccess  {Integer}   history.manifest_id   Id of the manifest
 * @apiSuccess  {String}    history.content       The content of the manifest
 * @apiSuccess  {String}    history.edition_date  Date of content edition
 *
 * @apiSuccessExample {json} Response
 * {
 *    "id": 56,
 *    "name": "to_compile",
 *    "creation_date": "2019-07-19T22:25:10.370Z",
 *    "last_update": "2019-07-19T22:25:10.370Z",
 *    "history": [
 *      {
 *          "id": 75,
 *          "manifest_id": 56,
 *          "content": "{{content of a python file manifest}}"
 *          "edition_date": "2019-07-19T22:25:10.370Z"
 *      }
 *    ]
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
 *          "param": "id",
 *          "detail": "must be an integer",
 *          "value": "bonjour"
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
class GetManifest extends AbstractAction {
  get validate () {
    return [
      param('id')
        .exists({ checkNull: true }).withMessage('required field')
        .isInt().withMessage('must be an integer')
    ]
  }

  async handler (req, res, next) {
    return this.app.controller.manifest.get(req.params.id)
  }
}

module.exports = GetManifest
