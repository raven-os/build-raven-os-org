const amqp = require('amqplib')

/*
 * Usage: const queue = await new Queue('queue_name')
 */
class Queue {
  constructor (name) {
    this.closeTimeout = 250
    this.name = name
    this.connection = null
    this.channel = null
  }

  async _getInstance () {
    if (!this.connection) {
      this.connection = await amqp.connect('amqp://localhost')
      this.channel = await this.connection.createChannel()
      this.channel.assertQueue(this.name, { durable: false })
    }

    return this.channel
  }

  async send (buffer) {
    (await this._getInstance()).sendToQueue(this.name, buffer)
  }

  async receive (callback) {
    return (await this._getInstance()).consume(this.name, callback, { noAck: true })
  }

  close () {
    if (this.connection) {
      setTimeout(() => {
        this.connection.close()
      }, this.closeTimeout)
    }
  }
}

module.exports = Queue
