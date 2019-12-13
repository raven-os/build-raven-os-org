const helper = require('./helper')

before(async function () {
  helper.app.logger.log = () => {}
  helper.app.logger.info = () => {}
  helper.app.logger.error = () => {}

  await helper.app.run()
})
