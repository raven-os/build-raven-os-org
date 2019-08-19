exports.up = (knex) => {
  return knex.schema
    .createTable('user_account', (table) => {
      table.increments('id').primary()
      table.string('firstname').notNullable()
      table.string('lastname').notNullable()
      table.string('email').unique().notNullable()
      table.string('password').notNullable()
      table.specificType('rights', 'text[]').notNullable().default('{}')
      table.datetime('creation_date', null).notNullable()
      table.datetime('last_access', null)
    })
}

exports.down = (knex) => {
  return knex.schema
    .dropTable('user')
}
