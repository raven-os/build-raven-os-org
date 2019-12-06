const { hashPassword } = require('./utils')

/**
 * Performs actions related to users
 *
 * @public
 * @class
 */
class UserController {
  constructor (app) {
    this.app = app
  }

  /**
   * Enumeration of rights
   *
   * @public
   */
  static get rights () {
    return {
      ADMIN: 'admin'
    }
  }

  /**
   * Verify if a user exists
   *
   * @public
   * @param  {Integer|String}  value ID or email of the manifest
   * @param  {String}          field Field to match the value on (id or email)
   * @return {Boolean}               true if the user exists, false otherwise
   */
  async exists (value, field = 'email') {
    const count = await this.app.database.model.user
      .where(field, value)
      .count()

    return count === '1'
  }

  /**
   * Use an invitation to create a user
   *
   * @public
   * @param  {Object}  input            Input data
   * @param  {Object}  input.invitation Invitation code
   * @param  {Object}  input.firstname  Firstname of the user
   * @param  {Object}  input.lastname   Lastname of the user
   * @param  {Object}  input.password   Password of the user
   * @return {Object}                   The new user
   * @throws {NotFound}                 If the invitation doesn't exists
   * @throws {BadRequest}               If the invitation is already used or expired
   */
  async create (input) {
    const _invitation = await this.app.controller.invitation._get(input.invitation)
    const invitation = _invitation.toJSON()
    const now = new Date()

    if (invitation.used_date) {
      throw new this.app.errors.BadRequest(`Invitation #${input.invitation} is already used`)
    }

    const expirationDate = new Date(invitation.creation_date)
    expirationDate.setMinutes(expirationDate.getMinutes() + invitation.expire_after)

    if (now > expirationDate) {
      throw new this.app.errors.BadRequest(`Invitation #${input.invitation} has expired`)
    }

    const user = await this.app.database.model.user.forge({
      firstname: input.firstname,
      lastname: input.lastname,
      email: invitation.email,
      password: await hashPassword(input.password),
      rights: invitation.rights,
      creation_date: now,
      last_access: null
    })
      .save()

    await this.app.controller.invitation.use(_invitation, now)

    return user.toJSON()
  }

  /**
   * Reset a user password
   *
   * @public
   * @param  {String}  email    User email
   * @param  {String}  password New password
   * @throws {NotFound}         If the user doesn't exists
   */
  async resetPassword (email, password) {
    const user = await this._get({ email })

    await user
      .save({ password: await hashPassword(password) }, { patch: true })
  }

  /**
   * Retrieve a user
   *
   * @private
   * @param  {Object}  data       Data
   * @param  {String}  data.id    ID of a user
   * @param  {String}  data.email Email of a user
   * @return {Bookshelf.Model}    Model user to perform database actions on
   * @throws {NotFound}           If the user doesn't exists
   */
  async _get ({ id, email }) {
    const filters = id ? ['id', id] : ['email', email]

    const userModel = await this.app.database.model.user
      .where(...filters)
      .fetch()

    if (!userModel) {
      throw new this.app.errors.NotFound(`User ${id ? '#' + id : email} not found`)
    }

    return userModel
  }

  /**
   * Retrieve a user
   *
   * @private
   * @param  {Object}  data       Data
   * @param  {String}  data.id    ID of a user
   * @param  {String}  data.email Email of a user
   * @return {Object}             The user
   * @throws {NotFound}           If the user doesn't exists
   */
  async get ({ id, email }) {
    const user = await this._get({ id, email })

    return user.toJSON()
  }

  /**
   * List all users that have a firstname, lastname or email
   * starting by the search query
   *
   * @public
   * @param  {String} search  Search query
   * @return {List}           List of users
   */
  async list (search) {
    const users = await this.app.database.model.user
      .query(qb => {
        qb.where('firstname', 'LIKE', search + '%')
          .orWhere('lastname', 'LIKE', search + '%')
          .orWhere('email', 'LIKE', search + '%')
      })
      .fetchAll({
        columns: ['id', 'firstname', 'lastname', 'email', 'rights', 'creation_date', 'last_access']
      })

    return users.toJSON()
  }
}

module.exports = UserController
