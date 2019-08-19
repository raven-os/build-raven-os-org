class UserController {
  constructor (app) {
    this.app = app
  }

  static get rights () {
    return {
      ADMIN: 'admin'
    }
  }
}

module.exports = UserController
