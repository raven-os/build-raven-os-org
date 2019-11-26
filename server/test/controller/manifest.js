const tracker = require('mock-knex').getTracker()
const Application = require('../../src/application')
const assert = require('assert')
const sinon = require('sinon')
const { assertThrowsAsync, assertDoesNotThrowAsync } = require('../../../utils/test')

const app = new Application()
const controller = app.controller.manifest
const errors = app.errors
const id = 42

describe('controller/manifest', () => {
  beforeEach(() => {
    tracker.install()
  })

  afterEach(() => {
    tracker.uninstall()
  })

  describe('exists', () => {
    const tests = [
      { label: 'doesn\'t exists', count: '0', expected: false },
      { label: 'exists (one result)', count: '1', expected: true },
      { label: 'exists (multiple result)', count: '15', expected: false }
    ]

    for (const test of tests) {
      it(`should return ${test.expected}, ${test.label}`, async () => {
        tracker.on('query', (query) => {
          assert.strictEqual(query.method, 'select')
          assert.strictEqual(query.bindings[0], id)
          query.response([{ count: test.count }])
        })

        const result = await controller.exists(id)

        assert.strictEqual(result, test.expected)
      })
    }
  })

  describe('_get', () => {
    it('id should be binded to the query', async () => {
      tracker.on('query', (query, step) => {
        [
          // select manifest
          function firstQuery () {
            assert.strictEqual(query.method, 'select')
            assert.strictEqual(query.bindings[0], id)
            query.response([{}])
          },
          // select manifest_content
          function secondQuery () {
            query.response([{ content: 'test' }])
          }
        ][step - 1]()
      })

      await controller._get(id)
    })

    it('should throw not found', async () => {
      tracker.on('query', (query) => {
        query.response([])
      })

      await assertThrowsAsync(async () => controller._get(id), errors.NotFound)
    })

    it('should succeed and return object', async () => {
      tracker.on('query', (query, step) => {
        [
          // select manifest
          function firstQuery () {
            query.response([{ id }])
          },
          // select manifest_content
          function secondQuery () {
            query.response([{ id: 39 }])
          }
        ][step - 1]()
      })

      const manifest = await assertDoesNotThrowAsync(async () => controller._get(id))

      assert.strictEqual(manifest.id, id)
    })
  })

  describe('create', () => {
    it('should succeed and create the manifest and its content', async () => {
      tracker.on('query', (query, step) => {
        [
          // insert manifest
          function firstQuery () {
            assert.strictEqual(query.method, 'insert')
            assert.strictEqual(query.bindings.includes('nameTest'), true)
            query.response([id])
          },
          function secondQuery () {
            query.response([id])
          },
          // insert manifest_content
          function thirdQuery () {
            assert.strictEqual(query.method, 'insert')
            assert.strictEqual(query.bindings.includes('contentTest'), true)
            assert.strictEqual(query.bindings.includes(id), true)
            query.response([49])
          },
          function fourthQuery () {
            query.response([49])
          }
        ][step - 1]()
      })

      const manifest = await assertDoesNotThrowAsync(async () => controller.create('nameTest', 'contentTest'))

      assert.strictEqual(manifest.id, id)
      assert.strictEqual(manifest.history.length, 1)
      assert.strictEqual(manifest.history[0].id, 49)
      assert.strictEqual(manifest.history[0].content, 'contentTest')
      assert.strictEqual(manifest.history[0].manifest_id, id)
      assert.strictEqual(manifest.creation_date, manifest.last_update)
    })
  })

  describe('updateContent', () => {
    it('should succeed and update the content and the manifest last_udate', async () => {
      const date = new Date('January 10 2010 10:10:10')
      const maintainer = { id: 9, firstname: 'john', lastname: 'DOE', rights: [] }
      const manifestToUpdate = {
        id,
        name: 'toUpdate',
        creation_date: date,
        last_update: date,
        author: maintainer,
        maintainer
      }
      const content = {
        manifest_id: id,
        id: 72,
        content: 'lorem ipsum',
        edition_date: date
      }

      tracker.on('query', (query, step) => {
        [
          // _get manifest
          function firstQuery () {
            query.response([manifestToUpdate])
          },
          // _get manifest_content
          function secondQuery () {
            query.response([content])
          },
          // _insertContent
          function thirdQuery () {
            assert.strictEqual(query.method, 'insert')
            assert.strictEqual(query.bindings.includes('new content'), true)
            assert.strictEqual(query.bindings.includes(id), true)
            query.response([73])
          },
          function fourthQuery () {
            query.response([73])
          },
          // save({ last_update })
          function fifthQuery () {
            assert.strictEqual(query.method, 'update')
            assert.strictEqual(query.bindings.includes(id), true)
            query.response([18])
          },
          function sixthQuery () {
            query.response([18])
          }
        ][step - 1]()
      })

      const manifestContent = await controller.updateContent(id, 'new content', maintainer)

      assert.strictEqual(manifestContent.manifest_id, id)
      assert.strictEqual(manifestContent.content, 'new content')
      assert.strictEqual(manifestContent.id, 73)
      assert.strictEqual(manifestContent.edition_date > manifestToUpdate.last_update, true)
    })
  })

  describe('get', () => {
    it('should succeed and return object', async () => {
      const manifestDate = new Date()
      const lastUpdateDate = new Date(Date.now() + 100000)
      const manifest = {
        id,
        name: 'testManifest',
        creation_date: manifestDate,
        last_update: lastUpdateDate
      }
      const manifestContents = [
        {
          id: 10,
          manifest_id: id,
          content: 'first content',
          edition_date: manifestDate
        },
        {
          id: 11,
          manifest_id: id,
          content: 'second content',
          edition_date: lastUpdateDate
        }
      ]
      tracker.on('query', (query, step) => {
        [
          // get manifest
          function firstQuery () {
            query.response([manifest])
          },
          // get manifest_content
          function secondQuery () {
            query.response(manifestContents)
          }
        ][step - 1]()
      })

      const spyGet = sinon.spy(controller, '_get')
      const res = await assertDoesNotThrowAsync(async () => controller.get(id))

      assert.strictEqual(spyGet.callCount, 1)
      assert.deepStrictEqual(spyGet.firstCall.args, [42])
      assert.deepStrictEqual(res, { ...manifest, history: manifestContents })
      spyGet.restore()
    })
  })

  describe('list', () => {
    let params
    let expectedData
    let expectedPagination
    let expectedHistory

    beforeEach(() => {
      params = {
        sort: 'creation_date',
        direction: 'ASC',
        name: 'manifest',
        pagination: {
          perPage: 15,
          page: 1
        }
      }

      expectedData = [{ id: 31 }, { id: 32 }]
      expectedHistory = [
        {
          id: 20,
          manifest_id: 31,
          content: 'test',
          edition_date: ''
        },
        {
          id: 21,
          manifest_id: 32,
          content: 'test',
          edition_date: ''
        }
      ]
      expectedPagination = {
        total: 34,
        perPage: params.pagination.perPage,
        currentPage: params.pagination.page,
        pageCount: 3
      }
    })

    it('should successfully list builds', async () => {
      tracker.on('query', (query, step) => {
        [
          // get manifest
          function firstQuery () {
            assert.strictEqual(query.bindings.includes(params.name + '%'), true)
            query.response(expectedData)
          },
          // count
          function secondQuery () {
            assert.strictEqual(query.bindings.includes(params.name + '%'), true)
            query.response([{ count: 34 }])
          },
          // get manifest_content
          function thirdQuery () {
            assert.deepStrictEqual(query.bindings, expectedData.map(e => e.id))
            query.response(expectedHistory)
          }
        ][step - 1]()
      })

      const res = await assertDoesNotThrowAsync(
        async () => controller.list(
          params.name,
          params.sort,
          params.direction,
          params.pagination
        )
      )

      expectedData[0].history = [expectedHistory[0]]
      expectedData[1].history = [expectedHistory[1]]

      assert.deepStrictEqual(res.data, expectedData)
      assert.deepStrictEqual(res.meta.pagination, expectedPagination)
    })
  })
})
