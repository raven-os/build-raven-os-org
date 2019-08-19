exports.up = (knex) => {
  return knex.schema
    .createTable('invitation', (table) => {
      table.increments('id').primary()
      table.uuid('uuid').unique().notNullable()
      table.string('email').notNullable()
      table.specificType('rights', 'text[]').notNullable().default('{}')
      table.integer('expire_after').unsigned().notNullable() // time in minutes
      table.datetime('creation_date', null).notNullable()
      table.datetime('used_date', null)
    })
}

exports.down = (knex) => {
  return knex.schema
    .dropTable('invitation')
}
