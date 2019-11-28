const config = require('../src/config')
const { hashPassword } = require('../src/controller/utils')

exports.up = async (knex) => {
  return knex('user_account').insert({
    firstname: 'Admin',
    lastname: 'ADMIN',
    email: config.admin.email,
    password: await hashPassword(config.admin.password),
    rights: ['admin'],
    creation_date: new Date(),
    last_access: null
  })
}

exports.down = async (knex) => {
  return knex('user_account')
    .where({ email: config.admin.email })
    .del()
}
