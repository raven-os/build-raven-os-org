exports.up = (knex) => {
  return knex.schema
    .createTable('manifest', (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.datetime('creation_date', true).notNullable()
      table.datetime('last_update', true).notNullable()
    })
}

exports.down = (knex) => {
  return knex.schema
    .dropTable('manifest')
}
