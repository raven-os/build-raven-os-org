const config = require('./config')
const Receiver = require('./receiver')

const receiver = new Receiver(config)

receiver.run()
  .then(() => {
    console.log('[receiver] started')
  })
  .catch(err => {
    console.error('[error.receiver]', err.message)
  })
