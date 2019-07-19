const mockKnex = require('mock-knex')
const knex = require('knex')({
  client: 'pg',
  debug: false
})

function mockDB () {
  return mockKnex.mock(knex)
}

function unmockDB () {
  return mockKnex.unmock(knex)
}

module.exports = { mockDB, unmockDB, knex }
