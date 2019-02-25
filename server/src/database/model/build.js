const bookshelf = require('../bookshelf')

const Build = bookshelf.Model.extend({
  tableName: 'build'
})

module.exports = Build
