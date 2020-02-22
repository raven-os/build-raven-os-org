const helper = require('../helper')
const request = require('supertest')
const assert = require('assert')

const adminRoutes = [
  { method: 'post', url: '/invite/' },
  { method: 'put', url: '/manifest/42/maintainer/' }
]

describe('middleware admin rights #integration', function () {
  describe('as admin user', function () {
    let cookie = null

    beforeEach(async function () {
      const res = await request(helper.app.server)
        .post('/api/auth/login')
        .send({
          email: helper.app.config.admin.email,
          password: helper.app.config.admin.password
        })

      cookie = res.headers['set-cookie'].pop().split(';')[0]
    })

    for (const route of adminRoutes) {
      it(`should NOT respond 403 on ${route.method} ${route.url}`, async function () {
        await request(helper.app.server)[route.method](`/api${route.url}`)
          .set('Cookie', cookie)
          .expect(({ statusCode }) => assert.strictEqual(statusCode !== 403, true))
      })
    }
  })

  describe('as non admin user', function () {
    let cookie = null

    beforeEach(async function () {
      const res = await request(helper.app.server)
        .post('/api/auth/login')
        .send({ email: 'test@build.com', password: 'toto42' })

      cookie = res.headers['set-cookie'].pop().split(';')[0]
    })

    for (const route of adminRoutes) {
      it(`should respond 403 on ${route.method} ${route.url}`, async function () {
        await request(helper.app.server)[route.method](`/api${route.url}`)
          .set('Cookie', cookie)
          .expect(({ statusCode }) => assert.strictEqual(statusCode === 403, true))
      })
    }
  })
})
