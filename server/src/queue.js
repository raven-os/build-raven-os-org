const amqp = require('amqplib')
const config = require('./config')

/**
 * Queue interacts with the RabbitMQ message broker using AMQP protocol
 *
 * @public
 * @class
 */
class Queue {
  /**
   * Instantiate the queue
   *
   * @constructor
   * @public
   * @param {String} name Name of the queue
   */
  constructor (name) {
    this.closeTimeout = 250
    this.name = name
    this.connection = null
    this.channel = null
  }

  /**
   * Ensure there is a connection to RabbitMQ and create a Channel
   *
   * @public
   * @return {Channel} The channel to communicate through
   */
  async _getInstance () {
    if (!this.connection) {
      await this.ensureConnection()
      this.channel = await this.connection.createChannel()
      this.channel.assertQueue(this.name, { durable: false })
    }

    return this.channel
  }

  /**
   * Try to connect to RabbitMQ multiple times if it fails
   *
   * @public
   */
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

  /**
   * Send a message to the queue
   *
   * @public
   * @param  {Buffer}  buffer The message to send
   */
  async send (buffer) {
    (await this._getInstance()).sendToQueue(this.name, buffer)
  }

  /**
   * Consume a message from the queue
   *
   * @public
   * @param  {Function} callback Function called when the message is consumed
   */
  async receive (callback) {
    return (await this._getInstance()).consume(this.name, callback, { noAck: true })
  }

  /**
   * Close the connection
   *
   * @public
   */
  close () {
    if (this.connection) {
      setTimeout(() => {
        this.connection.close()
      }, this.closeTimeout)
    }
  }
}

module.exports = Queue
