const AbstractAction = require('../abstract')
const { query } = require('express-validator/check')
const { sanitizeQuery } = require('express-validator/filter')
const lowercase = require('../sanitizer/lowercase')

/**
 * @api {get} /api/build List
 * @apiVersion 1.0.0
 * @apiGroup Build
 * @apiName BuildList
 *
 * @apiDescription List all builds
 *
 * @apiParam  (Query String) {Boolean}                          [queuing]           Search only builds in queuing state
 * @apiParam  (Query String) {Boolean}                          [running]           Search only builds in running state
 * @apiParam  (Query String) {Boolean}                          [exit_status]       Search only builds with the provided exit status
 * @apiParam  (Query String) {Boolean}                          [manifest_id]       Search only builds containing the list of provided manifest ids
 * @apiParam  (Query String) {String='creation','start','end'}  [sort='creation']   Sort by provided column
 * @apiParam  (Query String) {String='asc','desc'}              [dir='desc']        Direction of the sorting
 * @apiParam  (Query String) {Integer}                          [per_page=15]       Number of items returned per page
 * @apiParam  (Query String) {Integer}                          [page=1]            Page number
 *
 * @apiSuccess  {Object[]}                              data                        List of builds
 * @apiSuccess  {Integer}                               data.id                     Id of the build
 * @apiSuccess  {Integer[]}                             data.manifest_id            Ids of manifests to build
 * @apiSuccess  {Integer}                               [data.exit_status]          Exit status code
 * @apiSuccess  {String}                                data.stdout                 Logs from stdout
 * @apiSuccess  {String}                                data.stderr                 Errors logged on stderr
 * @apiSuccess  {String}                                data.creation_date          Date of creation
 * @apiSuccess  {String}                                [data.start_date]           Date when the build was started
 * @apiSuccess  {String}                                [data.end_date]             Date when the build ended
 * @apiSuccess  {String="queuing","running","finished"} data.state                  State of the build
 * @apiSuccess  {Object}                                meta                        Metadata of the paginated result
 * @apiSuccess  {Object}                                meta.pagination             Pagination information
 * @apiSuccess  {Integer}                               meta.pagination.total       Total number of item found
 * @apiSuccess  {Integer}                               meta.pagination.perPage     Number of item per page
 * @apiSuccess  {Integer}                               meta.pagination.currentPage Current page
 * @apiSuccess  {Integer}                               meta.pagination.pageCount   Number of pages containing results
 *
 * @apiSuccessExample {json} Response
 * {
 *    "data": [
 *      {
 *         "id": 56,
 *         "manifest_id": [42, 101],
 *         "exit_status": 83,
 *         "stdout": "npm install\nnpm test",
 *         "stderr": ""
 *         "creation_date": "2019-07-19T22:25:10.370Z",
 *         "start_date": "2019-07-19T22:25:10.370Z",
 *         "end_date": "2019-07-19T23:25:10.370Z",
 *         "state": "finished"
 *      },
 *      { ... }
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
 */
class ListBuild extends AbstractAction {
  get validate () {
    return [
      sanitizeQuery('sort')
        .customSanitizer(lowercase),
      sanitizeQuery('dir')
        .customSanitizer(lowercase),
      sanitizeQuery('queuing')
        .toBoolean(),
      sanitizeQuery('running')
        .toBoolean(),
      sanitizeQuery('manifest_id')
        .toInt(),
      sanitizeQuery('exit_status')
        .toInt(),
      query('sort')
        .optional()
        .isString().withMessage('must be a string')
        .isIn(['creation', 'start', 'end']).withMessage('sort should either be "creation", "start" or "end"'),
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
      'creation': 'creation_date',
      'start': 'start_date',
      'end': 'end_date'
    }
    // Default filters
    const sort = sortToColumnName[req.query.sort || 'creation']
    // Default direction is DESCENDING only if we are sorting by creation date
    const dir = req.query.dir || (sort === 'creation_date' ? 'desc' : 'asc')
    const filters = {
      queuing: req.query.queuing || null,
      running: req.query.running || null,
      manifestId: req.query.manifest_id || null,
      exitStatus: req.query.exit_status || null
    }

    const pagination = {
      page: req.query.page || 1,
      perPage: req.query.per_page || this.DEFAULT_ITEM_PER_PAGE
    }

    return this.app.controller.build.list(sort, dir, filters, pagination)
  }
}

module.exports = ListBuild
