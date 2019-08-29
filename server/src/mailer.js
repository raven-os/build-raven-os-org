const nodemailer = require('nodemailer')

class Mailer {
  constructor (app) {
    this.app = app
  }

  async init () {
    if (this.app.config.mailer.fake) {
      await this.fakeSmtp()
    } else {
      const transportConfig = this.app.config.mailer.transporter

      this.transporter = nodemailer.createTransport(transportConfig)
      await this.transporter.verify()
    }
  }

  async fakeSmtp () {
    const testAccount = await nodemailer.createTestAccount()
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    })
  }

  async send (to, subject, text) {
    console.log(this.app.config.mailer.from, to, subject, text)
    const info = await this.transporter.sendMail({
      from: this.app.config.mailer.from,
      to,
      subject,
      text
    })

    if (this.app.config.mailer.fake) {
      console.log('[nodemailer.preview]', nodemailer.getTestMessageUrl(info))
    }
  }
}

module.exports = Mailer
