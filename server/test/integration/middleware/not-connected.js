const helper = require('../helper')
const request = require('supertest')
const assert = require('assert')

const routes = [
  { method: 'post', url: '/auth/login/' },
  { method: 'post', url: '/auth/forgot/' },
  { method: 'put', url: '/auth/reset/' },
  { method: 'delete', url: '/auth/logout/' },
  { method: 'post', url: '/invite/' },
  { method: 'post', url: '/user/' },
  { method: 'get', url: '/user/42/' },
  { method: 'get', url: '/user/' },
  { method: 'post', url: '/manifest/' },
  { method: 'put', url: '/manifest/42/' },
  { method: 'put', url: '/manifest/42/maintainer' },
  { method: 'get', url: '/manifest/42/' },
  { method: 'get', url: '/manifest/' },
  { method: 'post', url: '/build/' },
  { method: 'get', url: '/build/42/' },
  { method: 'get', url: '/build/' }
]

describe('middleware session not connected #integration', function () {
  const willSucceed = [
    { method: 'post', url: '/auth/login/' },
    { method: 'post', url: '/auth/forgot/' },
    { method: 'put', url: '/auth/reset/' },
    { method: 'post', url: '/user/' }
  ]

  for (const route of routes) {
    const success = !!willSucceed.find(e => e.method === route.method && e.url === route.url)

    it(`should ${success ? 'NOT ' : ''}respond 401 on ${route.method} ${route.url}`, async function () {
      await request(helper.app.server)[route.method](`/api${route.url}`)
        .expect(({ statusCode }) => assert.strictEqual(statusCode !== 401, success))
    })
  }
})
