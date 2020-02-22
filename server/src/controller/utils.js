const bcrypt = require('bcrypt')
const InternalServerError = require('../errors/internal-server-error')
const BadRequest = require('../errors/bad-request')
const crypto = require('crypto')
const saltRounds = 10

/**
 * Hash a password
 *
 * @public
 * @param  {String}    password   A password
 * @return {String}               The hashed password
 * @throws {InternalServerError}  If bcrypt encounter an unexected error
 */
async function hashPassword (password) {
  const errorMessage = 'Unexpected error when hashing password'
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        reject(new InternalServerError(`${errorMessage}: ${err.message}`))
      } else {
        resolve(hash)
      }
    })
  })
}

/**
 * Compare a plain password with a hashed password
 *
 * @public
 * @param  {String}    plainPassword   A plain password
 * @param  {String}    hashedPassword  A hashed password
 * @throws {BadRequest}                If the passwords doesn't match
 * @throws {InternalServerError}       If bcrypt encounter an unexected error
 */
async function comparePassword (plainPassword, hashedPassword) {
  const errorMessage = 'Unexpected error when login'
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPassword, hashedPassword, (err, res) => {
      if (err) {
        reject(new InternalServerError(`${errorMessage}: ${err.message}`))
      } else if (!res) {
        reject(new BadRequest('Wrong password'))
      } else {
        resolve()
      }
    })
  })
}

/**
 * Generate a random token
 *
 * @public
 * @param   {Integer}    [size=20]   The size of the token in bytes
 * @returns {String}                 The token in hexadecimal
 * @throws  {InternalServerError}    If bcrypt encounter an unexected error
 */
async function generateToken (size = 20) {
  const errorMessage = 'Unexpected error when generating token'
  return new Promise((resolve, reject) => {
    crypto.randomBytes(size, (err, res) => {
      if (err) {
        reject(new InternalServerError(`${errorMessage}: ${err.message}`))
      } else {
        resolve(res.toString('hex'))
      }
    })
  })
}

module.exports = { hashPassword, comparePassword, generateToken }
