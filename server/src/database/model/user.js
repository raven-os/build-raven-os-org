const bookshelf = require('../bookshelf')

const User = bookshelf.Model.extend({
  tableName: 'user_account'
})

module.exports = User
