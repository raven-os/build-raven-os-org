const amqp = require('amqplib')
const config = require('./config')

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
      await this.ensureConnection()
      this.channel = await this.connection.createChannel()
      this.channel.assertQueue(this.name, { durable: false })
    }

    return this.channel
  }

  async ensureConnection () {
    let retries = config.queue.rabbitmq.retry.count || 5
    const interval = config.queue.rabbitmq.retry.interval || 1000
    const url = config.queue.rabbitmq.url || 'amqp://localhost:5672'

    while (retries) {
      try {
        this.connection = await amqp.connect(url)
        break
      } catch (err) {
        console.error('[queue.ensureConnection]', err)
        retries--
        console.info(`retries left: ${retries}, interval: ${interval} ms`)
        if (retries === 0) {
          throw err
        }
        await new Promise(resolve => setTimeout(resolve, interval))
      }
    }
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
