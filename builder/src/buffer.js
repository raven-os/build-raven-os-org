const config = require('./config')

/*
 * This buffer is used to have at least 1024 characters of output before sending
 * a request to prevent sending too much requests
 */
class Buffer {
  constructor () {
    this.size = config.buffer_size
    this.buffer = ''
  }

  write (str) {
    this.buffer += str

    if (this.buffer.length >= this.size) {
      return this.reset()
    }

    return null
  }

  reset () {
    const tmp = this.buffer
    this.buffer = ''

    return tmp
  }
}

module.exports = Buffer
