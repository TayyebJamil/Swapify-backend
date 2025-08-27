'use strict'
const jwt = require('jsonwebtoken')
module.exports = {
  token: (user) => {
    return new Promise((resolve, reject) => {
      const accessToken = jwt.sign(
        {
          _id: user?._id,
          fullName: user?.fullName
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: process.env.jwtExpireTime
        }
      )
      /* eslint-disable */
      if (accessToken) resolve(accessToken)
      else reject({ status: false, message: 'Error creating the Tokens' })
    })
  },
  authToken: (user, role) => {
    return new Promise((resolve, reject) => {
      const accessToken = jwt.sign(
        {
          _id: user?._id,
          fullName: user?.fullName,
          role
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: process.env.jwtExpireTime
        }
      )
      /* eslint-disable */
      if (accessToken) resolve(accessToken)
      else reject({ status: false, message: 'Error creating the Tokens' })
    })
  },
  verificationToken: (_id) => {
    return new Promise((resolve, reject) => {
      const token = jwt.sign(
        {
          _id
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: '1d'
        }
      )

      if (token) resolve(token)
      else reject({ status: false, message: 'Error creating the Tokens' })
    })
  },
  verfiyToken: (jwtToken) => {
    return new Promise((resolve, reject) => {
      jwt.verify(jwtToken, process.env.TOKEN_KEY, (err, decoded) => {
        if (err) reject({ status: false, message: 'Invalid Token Send' })
        else {
          resolve(decoded)
        }
      })
    })
  }
}
