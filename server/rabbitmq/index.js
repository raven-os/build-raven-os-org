const amqp = require('amqplib')

/*
 * Usage: const queue = await new Queue('queue_name')
 */
class Queue {
  constructor (name) {
    this.closeTimeout = 250
    this.name = name
    return (async () => {
      this.connection = await amqp.connect('amqp://localhost')
      this.channel = await this.connection.createChannel()
      this.channel.assertQueue(this.name, { durable: false })
      return this
    })()
  }

  send (buffer) {
    this.channel.sendToQueue(this.name, buffer)
  }

  receive (callback) {
    return this.channel.consume(this.name, callback, { noAck: true })
  }

  close () {
    setTimeout(() => {
      this.connection.close()
    }, this.closeTimeout)
  }
}

module.exports = Queue
