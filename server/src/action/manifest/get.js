const AbstractAction = require('../abstract')
const { param } = require('express-validator')

/**
 * @api {get} /api/manifest/:id Get
 * @apiVersion 1.0.0
 * @apiGroup Manifest
 * @apiName ManifestGet
 *
 * @apiDescription Fetch a manifest's content and metadata
 *
 * @apiHeader {String} Cookie Contains the session identifier `user_sid`
 *
 * @apiParam  (Params) {Integer}  id  ID of the manifest
 *
 * @apiSuccess  {Integer}   id                    ID of the manifest
 * @apiSuccess  {String}    name                  Name of the manifest
 * @apiSuccess  {String}    creation_date         Date of creation
 * @apiSuccess  {String}    last_update           Date of last update
 * @apiSuccess  {Integer}   author                User ID of the author
 * @apiSuccess  {Integer}   maintainer            User ID of the maintainer
 * @apiSuccess  {Object[]}  history               List of content (ordered by last_update)
 * @apiSuccess  {Integer}   history.id            ID of the content
 * @apiSuccess  {Integer}   history.manifest_id   ID of the manifest
 * @apiSuccess  {String}    history.content       Content of an edition of the manifest
 * @apiSuccess  {String}    history.edition_date  Date when the manifest was edited
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
 *
 * @apiErrorExample {json} Unauthorized 401
 * {
 *    "message": "You must be connected",
 *    "errors": []
 * }
 */
class GetManifest extends AbstractAction {
  get validate () {
    return [
      param('id')
        .exists({ checkNull: true }).withMessage('required field')
        .isInt().withMessage('must be an integer')
        .toInt()
    ]
  }

  async handler (req, res, next) {
    return this.app.controller.manifest.get(req.params.id)
  }
}

module.exports = GetManifest
