
exports.up = (knex) => {
  return knex.schema.table('build', (table) => {
    table.dropColumn('queuing')
    table.dropColumn('running')
    table.enu(
      'state',
      ['queuing', 'running', 'finished'],
      { useNative: true, enumName: 'state' }
    )
      .default('queuing')
      .notNullable()
  })
}

exports.down = (knex) => {
  return knex.schema.table('build', (table) => {
    table.boolean('queuing').default(true).notNullable()
    table.boolean('running').default(false).notNullable()
    table.dropColumn('state')
  })
}
