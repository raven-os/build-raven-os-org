const AbstractAction = require('../abstract')
const { query } = require('express-validator')
const lowercase = require('../sanitizer/lowercase')

/**
 * @api {get} /api/manifest List
 * @apiVersion 1.0.0
 * @apiGroup Manifest
 * @apiName ManifestList
 *
 * @apiDescription List all manifests
 *
 * @apiHeader {String} Cookie Contains the session identifier `user_sid`
 *
 * @apiParam  (Query String) {String}                             [name]              Search for manifests with a name starting with `name`
 * @apiParam  (Query String) {String='creation','update','name'}  [sort='creation']   Sort the results by the provided criteria
 * @apiParam  (Query String) {String='asc','desc'}                [dir='desc']        Sort direction
 * @apiParam  (Query String) {Integer}                            [per_page=15]       Number of items returned per page
 * @apiParam  (Query String) {Integer}                            [page=1]            Page number
 *
 * @apiSuccess  {Object[]}  data                        List of manifests
 * @apiSuccess  {Integer}   data.id                     ID of the manifest
 * @apiSuccess  {String}    data.name                   Name of the manifest
 * @apiSuccess  {String}    data.creation_date          Date of creation
 * @apiSuccess  {String}    data.last_update            Date of last update
 * @apiSuccess  {Integer}   data.author                 User ID of the author
 * @apiSuccess  {Integer}   data.maintainer             User ID of the maintainer
 * @apiSuccess  {Object[]}  data.history                List of content (ordered by last_update)
 * @apiSuccess  {Integer}   data.history.id             ID of the content
 * @apiSuccess  {Integer}   data.history.manifest_id    ID of the manifest
 * @apiSuccess  {String}    data.history.content        The content of the manifest
 * @apiSuccess  {String}    data.history.edition_date   Date of content edition
 * @apiSuccess  {Object}    meta                        Metadata of the paginated result
 * @apiSuccess  {Object}    meta.pagination             Pagination information
 * @apiSuccess  {Integer}   meta.pagination.total       Total number of item found
 * @apiSuccess  {Integer}   meta.pagination.perPage     Number of item per page
 * @apiSuccess  {Integer}   meta.pagination.currentPage Current page
 * @apiSuccess  {Integer}   meta.pagination.pageCount   Total number of pages
 *
 * @apiSuccessExample {json} Response
 * {
 *    "data": [
 *      {
 *         "id": 56,
 *         "name": "gcc",
 *         "creation_date": "2019-07-19T22:25:10.370Z",
 *         "last_update": "2019-07-19T22:25:10.370Z",
 *         "history": [
 *           {
 *              "id": 75,
 *              "manifest_id": 56,
 *              "content": "{{content of a build manifest (python)}}"
 *              "edition_date": "2019-07-19T22:25:10.370Z"
 *           },
 *           { ... }
 *         ]
 *      }
 *    ],
 *    "meta": {
 *       "pagination": {
 *          "total": 40,
 *          "perPage": 15,
 *          "currentPage": 1,
 *          "pageCount": 3
 *       }
 *    }
 * }
 *
 * @apiErrorExample {json} Unauthorized 401
 * {
 *    "message": "You must be connected",
 *    "errors": []
 * }
 */
class ListManifest extends AbstractAction {
  get validate () {
    return [
      query('name')
        .optional()
        .isString().withMessage('must be a string')
        .trim(),
      query('sort')
        .optional()
        .isString().withMessage('must be a string')
        .customSanitizer(lowercase)
        .isIn(['name', 'creation', 'update']).withMessage('sort should either be "name", "creation" or "update"'),
      query('dir')
        .optional()
        .isString().withMessage('must be a string')
        .customSanitizer(lowercase)
        .isIn(['asc', 'desc']).withMessage('direction should either be "asc" or "desc"'),
      query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('must be an integer higher or equal to 1')
        .toInt(),
      query('per_page')
        .optional()
        .isInt({ min: 1 }).withMessage('must be an integer higher or equal to 1')
        .toInt()
    ]
  }

  async handler (req, res, next) {
    const sortToColumnName = {
      'name': 'name',
      'creation': 'creation_date',
      'update': 'last_update'
    }
    // Default filters
    const name = req.query.name || ''
    const sort = sortToColumnName[req.query.sort || 'creation']
    // Default direction is DESCENDING only if we are sorting by creation date
    const dir = req.query.dir || (sort === 'creation_date' ? 'desc' : 'asc')

    const pagination = {
      page: req.query.page || 1,
      perPage: req.query.per_page || this.DEFAULT_ITEM_PER_PAGE
    }

    return this.app.controller.manifest.list(name, sort, dir, pagination)
  }
}

module.exports = ListManifest
