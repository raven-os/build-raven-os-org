exports.up = (knex) => {
  return knex.schema
    .createTable('build', (table) => {
      table.increments('id').primary()
      // TODO:  no foreign key, use  an array of ids
      table.integer('manifest_id').notNullable().references('manifest.id').onDelete('CASCADE')
      table.boolean('queuing').notNullable()
      table.boolean('running').notNullable()
      table.integer('exit_status')
      table.text('output')
      table.datetime('creation_date', null).notNullable()
      table.datetime('start_date', null)
      table.datetime('end_date', null)
    })
}

exports.down = (knex) => {
  return knex.schema
    .dropTable('build')
}
