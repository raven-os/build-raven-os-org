const Application = require('./application')

const app = new Application()

app.run()
  .catch(err => {
    console.error('application aborted')
    console.error(err)
    process.exit(1)
  })
