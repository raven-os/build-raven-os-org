const tracker = require('mock-knex').getTracker()
const Application = require('../../src/application')
const assert = require('assert')
const sinon = require('sinon')
const { assertThrowsAsync, assertDoesNotThrowAsync } = require('../../../utils/test')

const config = {
  builder_apikey: 'TESTING'
}
const app = new Application()
app.config = config
const controller = app.controller.build
const errors = app.errors
const id = 42

describe('controller/build', () => {
  beforeEach(() => {
    tracker.install()
  })

  afterEach(() => {
    tracker.uninstall()
  })

  describe('authorization', () => {
    it('should throw with wrong apikey', () => {
      assert.throws(() => controller.authorization('WRONG KEY'), errors.Forbidden)
    })

    it('should succeed with good apikey', () => {
      assert.doesNotThrow(() => controller.authorization('TESTING', errors.Forbidden))
    })
  })

  describe('_get', () => {
    it('id should be binded to the query', async () => {
      tracker.on('query', (query) => {
        assert.strictEqual(query.method, 'select')
        assert.strictEqual(query.bindings[0], id)
        query.response([{}])
      })

      await controller._get(id)
    })

    it('should throw not found', async () => {
      tracker.on('query', (query) => {
        query.response([])
      })

      await assertThrowsAsync(async () => controller._get(1), errors.NotFound)
    })

    it('should succeed and return object', async () => {
      tracker.on('query', (query) => {
        query.response([{ id: 3 }])
      })

      const build = await assertDoesNotThrowAsync(async () => controller._get(3))

      assert.strictEqual(build.id, 3)
    })
  })

  describe('create', () => {
    let stubExists
    let stubSend
    let stubIsMaintainer

    beforeEach(() => {
      stubExists = sinon.stub(app.controller.manifest, 'exists')
      stubSend = sinon.stub(app.queue, 'send')
      stubIsMaintainer = sinon.stub(app.controller.manifest, 'isMaintainer')
    })

    afterEach(() => {
      stubExists.restore()
      stubSend.restore()
      stubIsMaintainer.restore()
    })

    it('should throw manifest not found', async () => {
      stubExists.returns(false)

      await assertThrowsAsync(async () => controller.create([id]))

      assert.strictEqual(stubExists.callCount, 1)
      assert.deepStrictEqual(stubExists.firstCall.args, [id])
    })

    it('should succeed to create build', async () => {
      const buffer = Buffer.from('testing')
      const ids = [4, 5, 6]
      const spyJSON = sinon.spy(JSON, 'stringify')
      const stubBuffer = sinon.stub(Buffer, 'from')

      stubExists.onCall(0).returns(true)
      stubExists.onCall(1).returns(true)
      stubExists.onCall(2).returns(true)

      stubIsMaintainer.onCall(0).returns(true)
      stubIsMaintainer.onCall(1).returns(true)
      stubIsMaintainer.onCall(2).returns(true)

      tracker.on('query', (query, step) => {
        [
          function firstQuery () {
            assert.strictEqual(query.method, 'insert')
            assert.strictEqual(query.bindings.includes(ids, controller.state.QUEUING), true)
            query.response([12])
          },
          function secondQuery () {
            query.response([12])
          }
        ][step - 1]()
      })

      stubBuffer.returns(buffer)

      const res = await assertDoesNotThrowAsync(async () => controller.create(ids, { id: 9, rights: [] }))

      assert.strictEqual(stubExists.callCount, 3)
      assert.deepStrictEqual(stubExists.firstCall.args, [4])
      assert.deepStrictEqual(stubExists.secondCall.args, [5])
      assert.deepStrictEqual(stubExists.thirdCall.args, [6])
      assert.deepStrictEqual(stubIsMaintainer.firstCall.args, [4, 9])
      assert.deepStrictEqual(stubIsMaintainer.secondCall.args, [5, 9])
      assert.deepStrictEqual(stubIsMaintainer.thirdCall.args, [6, 9])
      assert.strictEqual(spyJSON.callCount, 1)
      assert.deepStrictEqual(spyJSON.firstCall.args, [{ build: 12, manifests: ids }])
      assert.strictEqual(stubBuffer.callCount, 1)
      assert.strictEqual(stubSend.callCount, 1)
      assert.deepStrictEqual(stubSend.firstCall.args, [buffer])

      assert.strictEqual(res.start_date, null)
      assert.strictEqual(res.end_date, null)
      assert.strictEqual(res.exit_status, null)
      assert.strictEqual(res.stdout, '')
      assert.strictEqual(res.stderr, '')
      assert.ok(res.id)
      assert.ok(res.creation_date)

      spyJSON.restore()
      stubBuffer.restore()
    })
  })

  // All the updates
  describe('updates functions', () => {
    let spyGet
    let spyBroadcast
    const wsActions = app.websocket.actions

    beforeEach(() => {
      spyGet = sinon.spy(controller, '_get')
      spyBroadcast = sinon.spy(app.websocket, 'broadcast')
    })

    afterEach(() => {
      spyGet.restore()
      spyBroadcast.restore()
    })

    const tests = [
      { name: 'stdout', id: 42, arg: 'stdout msg', ws: wsActions.BUILD_STDOUT, bindings: [42, 'stdout msg'] },
      { name: 'stderr', id: 42, arg: 'stderr msg', ws: wsActions.BUILD_STDERR, bindings: [42, 'stderr msg'] },
      { name: 'packages', id: 42, arg: 'packages msg', ws: wsActions.BUILD_PACKAGES, bindings: [42, 'packages msg'] },
      { name: 'start', id: 42, ws: wsActions.BUILD_START, bindings: [42, controller.state.RUNNING] },
      { name: 'end', id: 42, arg: 83, ws: wsActions.BUILD_END, bindings: [42, 83, controller.state.FINISHED] }
    ]

    // Used to assert that query bindings contains the stuff we want
    const containsAll = (haystack, needle) => {
      return needle.every(i => haystack.includes(i))
    }

    for (const test of tests) {
      describe(test.name, () => {
        it('should successfully updated ' + test.name, async () => {
          tracker.on('query', (query, step) => {
            [
              function firstQuery () {
                query.response([{ id: test.id }])
              },
              function secondQuery () {
                assert.strictEqual(query.method, 'update')
                assert.strictEqual(containsAll(query.bindings, test.bindings), true)
                query.response([{ id: test.id }])
              },
              function thirdQuery () {
                query.response([{ id: test.id }])
              }
            ][step - 1]()
          })

          const res = await assertDoesNotThrowAsync(async () => controller[test.name](test.id, test.arg))
          assert.strictEqual(spyGet.callCount, 1)
          assert.deepStrictEqual(spyGet.firstCall.args, [test.id])
          assert.strictEqual(spyBroadcast.callCount, 1)
          assert.deepStrictEqual(spyBroadcast.firstCall.args, [test.ws, res])
          assert.strictEqual(res.id, test.id)
        })
      })
    }
  })

  describe('get', () => {
    it('should succeed and return object', async () => {
      tracker.on('query', (query) => {
        query.response([{ id: 42, exit_status: 83 }])
      })

      const spyGet = sinon.spy(controller, '_get')
      const res = await assertDoesNotThrowAsync(async () => controller.get(42))

      assert.strictEqual(spyGet.callCount, 1)
      assert.deepStrictEqual(spyGet.firstCall.args, [42])
      assert.strictEqual(res.id, 42)
      assert.strictEqual(res.exit_status, 83)
      spyGet.restore()
    })
  })

  describe('list', () => {
    let params
    let expectedData
    let expectedPagination

    beforeEach(() => {
      params = {
        sort: 'creation_date',
        direction: 'ASC',
        filters: {
          queuing: true,
          running: false,
          manifestId: 42,
          exitStatus: 83
        },
        pagination: {
          perPage: 15,
          page: 1
        }
      }

      expectedData = [{ id: 31 }, { id: 32 }]
      expectedPagination = {
        total: 34,
        perPage: params.pagination.perPage,
        currentPage: params.pagination.page,
        pageCount: 3
      }
    })

    it('should successfully list builds with filters', async () => {
      tracker.on('query', (query, step) => {
        [
          function firstQuery () {
            assert.strictEqual(query.bindings.includes(...Object.values(params.filters)), true)
            query.response(expectedData)
          },
          function secondQuery () {
            assert.strictEqual(query.bindings.includes(...Object.values(params.filters)), true)
            query.response([{ count: 34 }])
          }
        ][step - 1]()
      })

      const res = await assertDoesNotThrowAsync(
        async () => controller.list(
          params.sort,
          params.direction,
          params.filters,
          params.pagination
        )
      )

      assert.deepStrictEqual(res.data, expectedData)
      assert.deepStrictEqual(res.meta.pagination, expectedPagination)
    })

    it('should successfully list builds without filters', async () => {
      params.filters = {
        queuing: null,
        running: null,
        manifestId: null,
        exitStatus: null
      }

      tracker.on('query', (query, step) => {
        [
          function firstQuery () {
            query.response(expectedData)
          },
          function secondQuery () {
            query.response([{ count: 34 }])
          }
        ][step - 1]()
      })

      const res = await assertDoesNotThrowAsync(
        async () => controller.list(
          params.sort,
          params.direction,
          params.filters,
          params.pagination
        )
      )

      assert.deepStrictEqual(res.data, expectedData)
      assert.deepStrictEqual(res.meta.pagination, expectedPagination)
    })
  })
})
