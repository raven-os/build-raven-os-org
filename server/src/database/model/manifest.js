const bookshelf = require('../bookshelf')

const Manifest = bookshelf.Model.extend({
  tableName: 'manifest'
})

module.exports = Manifest
