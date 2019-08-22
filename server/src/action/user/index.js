const CreateUser = require('./create')

class UserAction {
  constructor (app) {
    this.create = new CreateUser(app)
  }
}

module.exports = UserAction
