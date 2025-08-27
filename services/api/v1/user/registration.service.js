'use strict'
const UserModel = require('../../../../models/User')
const httpCode = require('../../../../utils/httpCodes')
const ErrorSerializer = require('../../../../Serializer/error.serializer')
const RegistrationSerializer = require('../../../../Serializer/registration.serializer')
const BcryptHelper = require('../../../../utils/bcrypt.helper')
const JwtService = require('../../../../externalServices/jwt')

module.exports = {
  register: async (req, data) => {
    try {
      const existingEmailMatch = { email: data?.email }

      data.email = data?.email.toLowerCase()

      const existingEmail = await UserModel.findOne(existingEmailMatch)

      if (existingEmail) {
        return {
          httpCode: httpCode.BAD_REQUEST,
          ...ErrorSerializer.error(
            httpCode.BAD_REQUEST,
            req.originalUrl,
            req.t('duplicateEmailError')
          )
        }
      }

      const companyName = await UserModel.find({
        companyName: data?.companyName
      })

      if (companyName?.length > 0)
        return {
          httpCode: httpCode.BAD_REQUEST,
          ...ErrorSerializer.error(
            httpCode.BAD_REQUEST,
            req.originalUrl,
            req.t('duplicateCompanyName')
          )
        }

      data.password = await BcryptHelper.generate(data?.password)
      let user = await UserModel.create(data)

      if (user?.roleId) {
        user = await UserModel.findById(user?._id).populate('roleId', 'name')
      }

      const authToken = await JwtService.authToken(user)

      return {
        httpCode: httpCode.CREATED,
        data: {
          ...RegistrationSerializer.serialize({
            ...user?._doc,
            authToken
          })
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
