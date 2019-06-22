const AbstractAction = require('../abstract')
const { query } = require('express-validator/check')
const { sanitizeQuery } = require('express-validator/filter')
const lowercase = require('../sanitizer/lowercase')

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
