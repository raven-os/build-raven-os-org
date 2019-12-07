const mock = require('mock-require')
const { unmockDB } = require('./knex')

mock('../../src/database/bookshelf', './mock-database')

after(() => {
  unmockDB()
})
