exports.up = (knex) => {
  return knex.schema
    .createTable('session', (table) => {
      table.string('sid').primary().notNullable()
      table.json('sess').notNullable()
      table.timestamp('expired', { precision: 6 }).notNullable().index()
    })
}

exports.down = (knex) => {
  return knex.schema
    .dropTable('session')
}
