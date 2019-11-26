const bookshelf = require('../bookshelf')

const User = bookshelf.Model.extend({
  requireFetch: false,
  tableName: 'user_account'
})

module.exports = User
