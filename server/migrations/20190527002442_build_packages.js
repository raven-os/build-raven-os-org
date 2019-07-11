
exports.up = (knex) => {
  return knex.schema.table('build', (table) => {
    table.specificType('packages', 'text[]').notNullable().default('{}')
  })
}

exports.down = (knex) => {
  return knex.schema.table('build', (table) => {
    table.dropColumn('packages')
  })
}
