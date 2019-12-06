const uuidv4 = require('uuid/v4')

/**
 * Performs actions related to invitations
 *
 * @public
 * @class
 */
class InvitationController {
  constructor (app) {
    this.app = app
  }

  /**
   * Retrieve an invitation by id
   *
   * @private
   * @param  {Integer}          uuid UUID of an invitation
   * @return {Bookshelf.Model}       Model invitation to perform database actions on
   * @throws {NotFound}              If the invitation doesn't exists
   */
  async _get (uuid) {
    const invitationModel = await this.app.database.model.invitation
      .where(this.app.database.utils.raw('uuid::text'), uuid)
      .fetch()

    if (!invitationModel) {
      throw new this.app.errors.NotFound(`Invitation #${uuid} not found`)
    }

    return invitationModel
  }

  /**
   * Create an invitation and send an invitation code by email
   *
   * @public
   * @param  {Object}  input              Input data
   * @param  {String}  input.email        Email of the invited user
   * @param  {String}  input.rights       Rights that the user will have
   * @param  {String}  input.expire_after Expiration time of the invitation in minutes
   * @return {Object}                     The invitation
   * @throws {BadRequest}                 If the a user is already registered with the email
   */
  async create (input) {
    const date = new Date()

    if (await this.app.controller.user.exists(input.email)) {
      throw new this.app.errors.BadRequest(`The email ${input.email} is already used`)
    }

    let invitation = await this.app.database.model.invitation.forge({
      uuid: uuidv4(),
      email: input.email,
      rights: input.rights,
      expire_after: input.expire_after,
      creation_date: date,
      used_date: null
    })
      .save()

    invitation = invitation.toJSON()

    const subject = 'Invitation for Raven\'s Package Builder'
    const text = `To subscribe to Raven's Package Builder, use this code: ${invitation.uuid}`

    await this.app.mailer.send(invitation.email, subject, text)

    return invitation
  }

  /**
   * Use an invitation
   *
   * @public
   * @param  {Bookshelf.Model}  invitation  Invitation being used
   * @param  {Date}             date        Used date
   */
  async use (invitation, date) {
    await invitation.save({ used_date: date })
  }
}

module.exports = InvitationController
