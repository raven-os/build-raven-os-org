const bookshelf = require('../bookshelf')

const ManifestContent = bookshelf.Model.extend({
  tableName: 'manifest_content'
})

module.exports = ManifestContent
