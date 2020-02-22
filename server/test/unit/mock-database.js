const { mockDB, knex } = require('./knex')

mockDB()
const bookshelf = require('bookshelf')(knex)

module.exports = bookshelf
