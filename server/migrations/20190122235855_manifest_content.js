exports.up = (knex) => {
  return knex.schema
    .createTable('manifest_content', (table) => {
      table.increments('id').primary()
      table.integer('manifest_id').notNullable().references('manifest.id').onDelete('CASCADE')
      table.text('content').notNullable()
      table.datetime('edition_date', true).notNullable()
    })
}

exports.down = (knex) => {
  return knex.schema
    .dropTable('manifest_content')
}
