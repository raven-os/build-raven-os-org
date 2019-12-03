const AbstractAction = require('../abstract')
const { body } = require('express-validator')

/**
 * @api {post} /api/manifest Create
 * @apiVersion 1.0.0
 * @apiGroup Manifest
 * @apiName ManifestCreate
 *
 * @apiDescription Create a new manifest that can be used to compile a package
 *
 * @apiHeader {String} Cookie Contains the session identifier `user_sid`
 *
 * @apiParam  (Body) {String{1..255}}  name    Name of the manifest
 * @apiParam  (Body) {String{1..}}     content Content of the manifest
 *
 * @apiParamExample {json} Request Body
 * {
 *    "name": "gcc",
 *    "content": "{{content of a build manifest (python)}}"
 * }
 *
 * @apiSuccess  {Integer}   id                    ID of the manifest
 * @apiSuccess  {String}    name                  Name of the manifest
 * @apiSuccess  {String}    creation_date         Date of creation
 * @apiSuccess  {String}    last_update           Date of last update
 * @apiSuccess  {Object[]}  history               List of content (ordered by last_update)
 * @apiSuccess  {Integer}   history.id            ID of the content
 * @apiSuccess  {Integer}   history.manifest_id   ID of the manifest
 * @apiSuccess  {String}    history.content       The content of the manifest
 * @apiSuccess  {String}    history.edition_date  Date of content edition
 *
 * @apiSuccessExample {json} Response
 * {
 *    "id": 56,
 *    "name": "gcc",
 *    "creation_date": "2019-07-19T22:25:10.370Z",
 *    "last_update": "2019-07-19T22:25:10.370Z",
 *    "history": [
 *      {
 *          "id": 75,
 *          "manifest_id": 56,
 *          "content": "{{content of a build manifest (python)}}"
 *          "edition_date": "2019-07-19T22:25:10.370Z"
 *      }
 *    ]
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
 *          "param": "name",
 *          "detail": "length must be between 1 and 255",
 *          "value": ""
 *      }
 *    ]
 * }
 *
 * @apiErrorExample {json} Unauthorized 401
 * {
 *    "message": "You must be connected",
 *    "errors": []
 * }
 */
class CreateManifest extends AbstractAction {
  get validate () {
    return [
      body('name')
        .exists({ checkNull: true }).withMessage('required field')
        .isString().withMessage('must be a string')
        .trim()
        .isLength({ min: 1, max: 255 }).withMessage('length must be between 1 and 255'),
      body('content')
        .exists({ checkNull: true }).withMessage('required field')
        .isString().withMessage('must be a string')
        .trim()
        .isLength({ min: 1 }).withMessage('length must be greater than 1')
    ]
  }

  async handler (req, res, next) {
    return this.app.controller.manifest.create(req.body.name, req.body.content, req.session.user.id)
  }
}

module.exports = CreateManifest
