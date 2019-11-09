const AbstractAction = require('../abstract')
const { body, param } = require('express-validator')

/**
 * @api {put} /api/manifest/:id/maintainer Update maintainer
 * @apiVersion 1.0.0
 * @apiGroup Manifest
 * @apiName ManifestMaintainerUpdate
 *
 * @apiDescription Update a manifest's maintainer
 *
 * @apiParam  (Params) {Integer}  id         ID of the manifest
 * @apiParam  (Body)   {Integer}  maintainer User ID of the new maintainer
 *
 * @apiParamExample {json} Request Body
 * {
 *    "maintainer": 9
 * }
 *
 * @apiSuccess  {Integer}   id                    ID of the manifest
 * @apiSuccess  {String}    name                  Name of the manifest
 * @apiSuccess  {String}    creation_date         Date of creation
 * @apiSuccess  {String}    last_update           Date of last update
 * @apiSuccess  {Object}    author                Author of the manifest
 * @apiSuccess  {Integer}   author.id             ID of the author
 * @apiSuccess  {String}    author.firstname      Firstname of the author
 * @apiSuccess  {String}    author.lastname       Lastname of the author
 * @apiSuccess  {Object}    maintainer            Maintainer of the manifest
 * @apiSuccess  {Integer}   maintainer.id         ID of the maintainer
 * @apiSuccess  {String}    maintainer.firstname  Firstname of the maintainer
 * @apiSuccess  {String}    maintainer.lastname   Lastname of the maintainer
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
 *    "author": {
 *        "id": 10,
 *        "firstname: "John",
 *        "lastname": "DOE"
 *    },
 *    "maintainer": {
 *        "id": 9,
 *        "firstname": "Jean",
 *        "lastname": "Neige"
 *    },
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
 * @apiErrorExample {json} Not Found 404
 * {
 *    "message": "Manifest #42 not found",
 *    "errors": []
 * }
 */
class UpdateManifestMaintainer extends AbstractAction {
  get validate () {
    return [
      param('id')
        .exists({ checkNull: true }).withMessage('required field')
        .isInt().withMessage('must be an integer')
        .toInt(),
      body('maintainer')
        .exists({ checkNull: true }).withMessage('required field')
        .isInt().withMessage('must be an integer')
        .toInt()
    ]
  }

  async handler (req, res, next) {
    return this.app.controller.manifest.updateMaintainer(req.params.id, req.body.maintainer)
  }
}

module.exports = UpdateManifestMaintainer
