const AbstractAction = require('../abstract')
const { body } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

/**
 * @api {post} /api/manifest Create
 * @apiVersion 1.0.0
 * @apiGroup Manifest
 * @apiName ManifestCreate
 *
 * @apiDescription Crée un manifest de compilation
 *
 * @apiParam  (Body) {String}  name    Name of the manifest (length must be between 1 and 255)
 * @apiParam  (Body) {String}  content Content of the manifest (length must be greater than 1)
 *
 * @apiParamExample {json} Request Body
 * {
 *    "name": "bonjour",
 *    "content": "{{content of a python file manifest}}"
 * }
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
 *          "param": "name",
 *          "detail": "length must be between 1 and 255",
 *          "value": ""
 *      }
 *    ]
 * }
 */
class CreateManifest extends AbstractAction {
  get validate () {
    return [
      sanitizeBody('name').trim(),
      sanitizeBody('content').trim(),
      body('name')
        .exists({ checkNull: true }).withMessage('required field')
        .isString().withMessage('must be a string')
        .isLength({ min: 1, max: 255 }).withMessage('length must be between 1 and 255'),
      body('content')
        .exists({ checkNull: true }).withMessage('required field')
        .isString().withMessage('must be a string')
        .isLength({ min: 1 }).withMessage('length must be greater than 1')
    ]
  }

  async handler (req, res, next) {
    return this.app.controller.manifest.create(req.body.name, req.body.content)
  }
}

module.exports = CreateManifest
