const helper = require('./helper')

before(async function () {
  const noop = () => {}

  helper.app.logger.log = noop
  helper.app.logger.info = noop
  helper.app.logger.error = noop

  helper.app.queue = {
    _getInstance: noop,
    ensureConnection: noop,
    send: noop,
    receive: noop,
    close: noop
  }

  await helper.app.run()
})
