const AbstractAction = require('../abstract')
const { query } = require('express-validator/check')
const { sanitizeQuery } = require('express-validator/filter')
const lowercase = require('../sanitizer/lowercase')

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
        .isIn(['creation', 'start', 'end']).withMessage('sort by creation, start, end'),
      query('dir')
        .optional()
        .isString().withMessage('must be a string')
        .isIn(['asc', 'desc']).withMessage('direction is asc or desc')
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
    // Default direction is DESCENDING only if sort by creation
    const dir = req.query.dir || (sort === 'creation_date' ? 'desc' : 'asc')
    const filters = {
      queuing: req.query.queuing || null,
      running: req.query.running || null,
      manifestId: req.query.manifest_id || null,
      exitStatus: req.query.exit_status || null
    }

    return this.app.controller.build.list(sort, dir, filters)
  }
}

module.exports = ListBuild
