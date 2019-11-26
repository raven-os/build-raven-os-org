const bookshelf = require('../bookshelf')

const ManifestContent = bookshelf.Model.extend({
  requireFetch: false,
  tableName: 'manifest_content'
})

module.exports = ManifestContent
