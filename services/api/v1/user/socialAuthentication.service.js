'use strict'
const UserModel = require('../../../../models/User')
const RegistrationSerializer = require('../../../../Serializer/registration.serializer.js')
const httpCode = require('../../../../utils/httpCodes')
const ErrorSerializer = require('../../../../Serializer/error.serializer.js')
const JwtService = require('../../../../externalServices/jwt')

module.exports = {
  google: async (req) => {
    try {
      const body = req?.body?.data?.attributes

      const user = body?.userInfo
      if (user && user?.email) {
        const check = await UserModel.findOne({
          email: user?.email
        })
        if (check) {
          if (!check?.socialAuth) {
            check.socialAuth = true
            check.save()
          }
          const authToken = await JwtService.authToken(check)
          const verified = check.isEmailVerified
          delete check.isEmailVerified
          return {
            httpCode: httpCode.OK,
            data: {
              authToken,
              ...RegistrationSerializer.serialize({
                ...check._doc,
                isEmailVerified: verified
              })
            }
          }
        } else {
          delete body?.userInfo.id
          body.isEmailVerified = true
          body.userInfo.socialAuth = true

          const name = body?.userInfo.name

          if (name && name.includes(' ')) {
            const nameParts = name.split(' ')
            body.userInfo.firstName = nameParts[0]
            body.userInfo.lastName = nameParts.slice(1).join(' ')
          } else {
            body.userInfo.firstName = name
            body.userInfo.lastName = ''
          }

          const created = await UserModel.create(body?.userInfo)

          if (created) {
            const authToken = await JwtService.authToken(created)
            const verified = created.isEmailVerified
            delete created.isEmailVerified
            return {
              httpCode: httpCode.CREATED,
              data: {
                authToken,
                ...RegistrationSerializer.serialize({
                  ...created._doc,
                  isEmailVerified: verified
                })
              }
            }
          }
        }
      } else {
        return {
          httpCode: httpCode.BAD_REQUEST,
          ...ErrorSerializer.error(
            httpCode.BAD_REQUEST,
            req.originalUrl,
            'Google login failed'
          )
        }
      }
    } catch (error) {
      return {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        errors: [{ message: error.message }]
      }
    }
  }
}
