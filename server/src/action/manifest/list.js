const AbstractAction = require('../abstract')
const { query } = require('express-validator/check')
const { sanitizeQuery } = require('express-validator/filter')
const lowercase = require('../sanitizer/lowercase')

/**
 * @api {get} /api/manifest List
 * @apiVersion 1.0.0
 * @apiGroup Manifest
 * @apiName ManifestList
 *
 * @apiDescription List all manifests
 *
 * @apiParam  (Query String) {String}                             [name]              Search for manifests with a name starting with `name`
 * @apiParam  (Query String) {String='creation','update','name'}  [sort='creation']   Sort the results by the provided criteria
 * @apiParam  (Query String) {String='asc','desc'}                [dir='desc']        Sort direction
 * @apiParam  (Query String) {Integer}                            [per_page=15]       Number of items returned per page
 * @apiParam  (Query String) {Integer}                            [page=1]            Page number
 *
 * @apiSuccess  {Object[]}  data                        List of manifests
 * @apiSuccess  {Integer}   data.id                     Id of the manifest
 * @apiSuccess  {String}    data.name                   Name of the manifest
 * @apiSuccess  {String}    data.creation_date          Date of creation
 * @apiSuccess  {String}    data.last_update            Date of last update
 * @apiSuccess  {Object[]}  data.history                List of content (last updated first)
 * @apiSuccess  {Integer}   data.history.id             Id of the content
 * @apiSuccess  {Integer}   data.history.manifest_id    Id of the manifest
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
 *         "name": "to_compile",
 *         "creation_date": "2019-07-19T22:25:10.370Z",
 *         "last_update": "2019-07-19T22:25:10.370Z",
 *         "history": [
 *           {
 *              "id": 75,
 *              "manifest_id": 56,
 *              "content": "{{content of a python file manifest}}"
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
 */
class ListManifest extends AbstractAction {
  get validate () {
    return [
      sanitizeQuery('sort')
        .customSanitizer(lowercase),
      sanitizeQuery('dir')
        .customSanitizer(lowercase),
      query('sort')
        .optional()
        .isString().withMessage('must be a string')
        .isIn(['name', 'creation', 'update']).withMessage('sort should either be "name", "creation" or "update"'),
      query('dir')
        .optional()
        .isString().withMessage('must be a string')
        .isIn(['asc', 'desc']).withMessage('direction should either be "asc" or "desc"'),
      query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('must be an integer higher or equal to 1'),
      query('per_page')
        .optional()
        .isInt({ min: 1 }).withMessage('must be an integer higher or equal to 1')
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
