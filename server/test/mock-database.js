const { mockDB, knex } = require('./knex')

mockDB()
const bookshelf = require('bookshelf')(knex)

bookshelf.plugin('pagination')

module.exports = bookshelf
