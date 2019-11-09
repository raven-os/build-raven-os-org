const bookshelf = require('../bookshelf')

const Build = bookshelf.Model.extend({
  requireFetch: false,
  tableName: 'build'
})

module.exports = Build
