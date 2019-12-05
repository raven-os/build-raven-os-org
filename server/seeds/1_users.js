const { hashPassword } = require('../src/controller/utils')

exports.seed = (knex) => {
  // Deletes ALL existing entries except the first one (admin)
  return knex('user_account')
    .whereNot({ id: 1 })
    .del()
    .then(async () => {
      // Inserts seed entries
      return knex('user_account').insert([
        {
          id: 2,
          firstname: 'Test',
          lastname: 'BUILD',
          email: 'test@build.com',
          password: await hashPassword('toto42'),
          rights: [],
          creation_date: new Date(),
          last_access: null
        },
        {
          id: 3,
          firstname: 'John',
          lastname: 'DOE',
          email: 'john.doe@build.com',
          password: await hashPassword('toto42'),
          rights: [],
          creation_date: new Date(),
          last_access: null
        },
        {
          id: 4,
          firstname: 'Jean',
          lastname: 'NEIGE',
          email: 'jean.neige@build.com',
          password: await hashPassword('toto42'),
          rights: [],
          creation_date: new Date(),
          last_access: null
        },
        {
          id: 5,
          firstname: 'Tony',
          lastname: 'STARK',
          email: 'tony.stark@build.com',
          password: await hashPassword('toto42'),
          rights: [],
          creation_date: new Date(),
          last_access: null
        }
      ])
    })
}
