const Receiver = require('./receiver')
const receiver = new Receiver()

receiver.run()
  .then(() => {
    console.log('[receiver] started')
  })
  .catch(err => {
    console.error('[error.receiver]', err.message)
  })
