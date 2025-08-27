'use strict'
const UserModel = require('../../../../models/User')
const RegistrationSerializer = require('../../../../Serializer/registration.serializer')
const httpCode = require('../../../../utils/httpCodes')
const ErrorSerializer = require('../../../../Serializer/error.serializer')
const BcryptHelper = require('../../../../utils/bcrypt.helper')
const JwtService = require('../../../../externalServices/jwt')
const UserHelper = require('../../../../helper/api/v1/user.helper')
const { sendEmail } = require('../../../../externalServices/nodeMailer/base')

module.exports = {
  login: async (req, body) => {
    try {
      let { email, password } = body
      email = email.toLowerCase()

      const user = await UserModel.findOne({
        email,
        isDeleted: { $ne: true }
      }).populate('roleId', 'name')

      if (!user) {
        return {
          httpCode: httpCode.BAD_REQUEST,
          ...ErrorSerializer.error(
            httpCode.BAD_REQUEST,
            req.originalUrl,
            req.t('noUserFound')
          )
        }
      } else if (!user.password) {
        return {
          httpCode: httpCode.BAD_REQUEST,
          ...ErrorSerializer.error(
            httpCode.BAD_REQUEST,
            req.originalUrl,
            req.t('noUserPasswordFound')
          )
        }
      } else {
        if (!(await BcryptHelper.compare(password, user.password))) {
          return {
            httpCode: httpCode.BAD_REQUEST,
            ...ErrorSerializer.error(
              httpCode.BAD_REQUEST,
              req.originalUrl,
              req.t('invalidPasswordDescription')
            )
          }
        } else {
          if (user?.isBlock) {
            return {
              httpCode: httpCode.BAD_REQUEST,
              ...ErrorSerializer.error(
                httpCode.BAD_REQUEST,
                req.originalUrl,
                req.t('userBlocked')
              )
            }
          }
          const authToken = await JwtService.token(user)
          delete user.password

          return {
            httpCode: httpCode.OK,
            data: {
              authToken,
              ...RegistrationSerializer.serialize(user)
            }
          }
        }
      }
    } catch (error) {
      console.log('error...........=> ', error)
      return {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        errors: [{ message: error.message }]
      }
    }
  },
  patch: async (req, body) => {
    try {
      const user = await UserModel.findOne({ email: body?.email })
      if (user) {
        const { tempCode, codeCreationTime } = await UserHelper.tempCode()
        await UserModel.updateOne(
          { _id: user._id },

          {
            code: tempCode,
            codeCreatedAt: codeCreationTime,
            passwordChangedRequest: true
          }
        )

        if (tempCode) {
          sendEmail([user], 'en')

          return {
            httpCode: httpCode.OK,
            data: {
              ...RegistrationSerializer.serialize(user)
            }
          }
        } else {
          return {
            httpCode: httpCode.BAD_REQUEST,
            ...ErrorSerializer.error(
              httpCode.BAD_REQUEST,
              req.originalUrl,
              req.t('sendingEmail')
            )
          }
        }
      } else {
        return {
          httpCode: httpCode.BAD_REQUEST,
          ...ErrorSerializer.error(
            httpCode.BAD_REQUEST,
            req.originalUrl,
            req.t('no-user')
          )
        }
      }
    } catch (error) {
      return {
        httpCode: httpCode.BAD_REQUEST,
        errors: [{ message: error.message }]
      }
    }
  },
  token: async (req, code) => {
    try {
      const user = await UserModel.findOne({
        code,
        passwordChangedRequest: true,
        isDeleted: { $ne: true }
      })

      if (user) {
        const updateUser = await UserModel.findOneAndUpdate(
          { _id: user?._id, code },
          {
            returnDocument: true,
            returnOriginal: false,
            new: true
          }
        )

        return {
          httpCode: httpCode.OK,
          data: {
            ...RegistrationSerializer.serialize(updateUser)
          }
        }
      } else {
        return {
          httpCode: httpCode.NO_CONTENT,
          ...ErrorSerializer.error(
            httpCode.BAD_REQUEST,
            req.originalUrl,
            req.t('userNotFound')
          )
        }
      }
    } catch (error) {
      return {
        httpCode: httpCode.BAD_REQUEST,
        errors: [{ message: error.message }]
      }
    }
  },
  update: async (loggedInUser, newPassword, req) => {
    try {
      const user = await UserModel.findOne({
        _id: loggedInUser._id,
        isDeleted: { $ne: true }
      })

      if (user) {
        const hashedPassword = await BcryptHelper.generate(newPassword)
        const update = await UserModel.findOneAndUpdate(
          {
            _id: loggedInUser._id
          },
          { password: hashedPassword, isComplete: true },
          {
            returnDocument: true,
            returnOriginal: false,
            new: true
          }
        )
        if (update) {
          return {
            httpCode: httpCode.OK,
            data: {
              ...RegistrationSerializer.serialize(user)
            }
          }
        } else {
          return {
            httpCode: httpCode.BAD_REQUEST,
            ...ErrorSerializer.error(
              httpCode.BAD_REQUEST,
              req.originalUrl,
              req.t('invalidData')
            )
          }
        }
      } else {
        return {
          httpCode: httpCode.NO_CONTENT,
          ...ErrorSerializer.error(
            httpCode.BAD_REQUEST,
            req.originalUrl,
            req.t('userNotFound')
          )
        }
      }
    } catch (error) {
      return {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        errors: [{ message: error.message }]
      }
    }
  },
  reset: async (req) => {
    try {
      const body = req?.body?.data?.attributes
      const { code } = req?.params
      const decoded = await UserModel.findOne({
        code,
        isDeleted: { $ne: true }
      })

      if (decoded?._id) {
        const user = await UserModel.findOne({
          _id: decoded?._id
        })

        if (user?._id) {
          const hashedPassword = await BcryptHelper.generate(body?.newPassword)
          const update = await UserModel.findOneAndUpdate(
            {
              _id: user?._id,
              passwordChangedRequest: true,
              isDeleted: { $ne: true }
            },
            {
              code: '',
              codeCreatedAt: '',
              password: hashedPassword,
              passwordChangedRequest: false
            },
            {
              returnDocument: true,
              returnOriginal: false,
              new: true
            }
          )
          if (update) {
            sendEmail([user], 'en')

            return {
              httpCode: httpCode.OK,
              data: {
                ...RegistrationSerializer.serialize(update)
              }
            }
          } else {
            return {
              httpCode: httpCode.BAD_REQUEST,
              ...ErrorSerializer.error(
                httpCode.BAD_REQUEST,
                req.originalUrl,
                req.t('invalidData')
              )
            }
          }
        } else
          return {
            httpCode: httpCode.BAD_REQUEST,
            ...ErrorSerializer.error(
              httpCode.BAD_REQUEST,
              req.originalUrl,
              req.t('invalidData')
            )
          }
      } else {
        return {
          httpCode: httpCode.NO_CONTENT,
          ...ErrorSerializer.error(
            httpCode.BAD_REQUEST,
            req.originalUrl,
            req.t('userNotFound')
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
