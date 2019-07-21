const assert = require('assert')

// Wrap throwing and not throwing asserts for async calls

async function assertThrowsAsync (fn, error, message) {
  let f = () => {}
  try {
    await fn()
  } catch (e) {
    f = () => { throw e }
  } finally {
    assert.throws(f, error, message)
  }
}

async function assertDoesNotThrowAsync (fn) {
  let f = () => {}
  try {
    return await fn()
  } catch (e) {
    f = () => { throw e }
  } finally {
    assert.doesNotThrow(f)
  }
}

module.exports = { assertThrowsAsync, assertDoesNotThrowAsync }
