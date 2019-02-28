exports.up = (knex) => {
  return knex.schema
    .createTable('build', (table) => {
      table.increments('id').primary()
      table.specificType('manifest_id', 'INT[]').notNullable()
      table.boolean('queuing').notNullable()
      table.boolean('running').notNullable()
      table.integer('exit_status')
      table.text('stdout')
      table.text('stderr')
      table.datetime('creation_date', null).notNullable()
      table.datetime('start_date', null)
      table.datetime('end_date', null)
    })
}

exports.down = (knex) => {
  return knex.schema
    .dropTable('build')
}
