const helper = require('../helper')
const request = require('supertest')
const assert = require('assert')

const builderRoutes = [
  { method: 'put', url: '/build/42/' },
  { method: 'put', url: '/build/42/start/' },
  { method: 'put', url: '/build/42/stdout/' },
  { method: 'put', url: '/build/42/stderr/' },
  { method: 'put', url: '/build/42/end/' },
  { method: 'put', url: '/build/42/packages/' }
]

describe('middleware builder authorization #integration', function () {
  it('should NOT respond 401 or 403 with authorization on get /manifest/42/', async function () {
    await request(helper.app.server)
      .get('/api/manifest/42/')
      .set('Authorization', helper.app.config.builder_apikey)
      .expect(({ statusCode }) => assert.strictEqual(statusCode !== 401 && statusCode !== 403, true))
  })

  for (const route of builderRoutes) {
    it(`should respond 403 without authorization on ${route.method} ${route.url}`, async function () {
      await request(helper.app.server)[route.method](`/api${route.url}`)
        .set('Authorization', 'This is a wrong apikey')
        .expect(({ statusCode }) => assert.strictEqual(statusCode === 403, true))
    })

    it(`should NOT respond 403 with authorization on ${route.method} ${route.url}`, async function () {
      await request(helper.app.server)[route.method](`/api${route.url}`)
        .set('Authorization', helper.app.config.builder_apikey)
        .expect(({ statusCode }) => assert.strictEqual(statusCode !== 403, true))
    })
  }
})
