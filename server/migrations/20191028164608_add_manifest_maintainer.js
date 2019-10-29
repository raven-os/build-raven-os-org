
exports.up = (knex) => {
  return knex.schema.table('manifest', (table) => {
    table.integer('author').references('user_account.id').onDelete('SET NULL')
    table.integer('maintainer').references('user_account.id').onDelete('SET NULL')
  })
}

exports.down = (knex) => {
  return knex.schema.table('manifest', (table) => {
    table.dropColumn('author')
    table.dropColumn('maintainer')
  })
}
