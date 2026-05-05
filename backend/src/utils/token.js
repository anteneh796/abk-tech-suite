const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const jwtConfig = require('../config/jwt')

function signAccessToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, jwtConfig.accessSecret, {
    expiresIn: jwtConfig.accessExpires,
  })
}

function signRefreshToken(user) {
  // include a tokenId for easier rotation/invalidation
  const tokenId = crypto.randomUUID()
  return jwt.sign({ id: user._id, tokenId }, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpires,
  })
}

function verifyAccessToken(token) {
  return jwt.verify(token, jwtConfig.accessSecret)
}

function verifyRefreshToken(token) {
  return jwt.verify(token, jwtConfig.refreshSecret)
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
}
