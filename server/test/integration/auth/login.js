const helper = require('../helper')
const request = require('supertest')

describe('auth/login #integration', function () {
  it('should respond 200 as admin', async function () {
    await request(helper.app.server)
      .post('/api/auth/login')
      .send({
        email: helper.app.config.admin.email,
        password: helper.app.config.admin.password
      })
      .expect(200)
  })
})
