'use strict'
const UserModel = require('../../models/User')
const ApplicationRoles = require('../../config/role')
const ObjectId = require('mongodb').ObjectId
const UserSerializer = require('../../Serializer/user.serializer')
const httpCode = require('../../utils/httpCodes')
const httpCodestatus = require('../../utils/httpCodes')
const bcryptHelper = require('../../utils/bcrypt.helper')

module.exports = {
  list: async (req) => {
    try {
      const users = await UserModel.aggregate([
        {
          $lookup: {
            from: 'roles',
            localField: 'roleId',
            foreignField: '_id',
            as: 'userRoles'
          }
        },
        {
          $match: {
            'userRoles.name': {
              $nin: [ApplicationRoles.admin, ApplicationRoles.agent]
            }
          }
        },
        {
          $project: {
            firstName: 1,
            lastName: 1,
            email: 1,
            gender: 1,
            isDeleted: 1,
            createdAt: 1
          }
        },
        { $sort: { createdAt: -1 } }
      ])
      if (users) {
        return {
          httpCode: httpCode.OK,
          resources: UserSerializer.serialize(users),
          path: 'users/list'
        }
      } else {
        return {
          httpCode: httpCodestatus.NO_CONTENT,
          data: {
            path: 'users/list'
          }
        }
      }
    } catch (error) {
      return {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        errors: [{ message: error.message }]
      }
    }
  },
  show: async (req) => {
    try {
      const { userId } = req.params
      const user = await UserModel.findOne({
        _id: new ObjectId(userId)
      }).select('-password')

      if (user) {
        return {
          httpCode: httpCode.OK,
          resources: UserSerializer.serialize(user),
          path: 'users/show'
        }
      } else {
        req.flash('error', req.t('noDetialsUser'))
        return {
          httpCode: httpCodestatus.BAD_REQUEST,
          path: 'users/list',
          data: {
            users: UserSerializer.serialize(user),
            path: 'users/list'
          }
        }
      }
    } catch (error) {
      return {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        errors: [{ message: error.message }]
      }
    }
  },
  new: async (req) => {
    try {
      return {
        httpCode: httpCode.OK,
        path: 'users/new'
      }
    } catch (error) {
      return {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      }
    }
  },
  create: async (req) => {
    try {
      const data = req?.body
      const { password } = req.body
      const findUser = await UserModel.findOne({
        $or: [{ email: data?.email }]
      }).select('-password')

      if (findUser) {
        req.flash('error', req.t('userDuplicate'))
        return {
          httpCode: httpCode.BAD_REQUEST,
          path: 'users/new',
          req
        }
      } else {
        const encryptedPassword = await bcryptHelper.generateHashPassword(
          password
        )

        data.password = encryptedPassword
        const userCreated = await UserModel.create(Object.assign(data))
        if (userCreated) {
          req.flash('success', req.t('accountCreated'))
          return {
            httpCode: httpCode.OK,
            path: 'users',
            req
          }
        } else {
          req.flash('error', req.t('accountCreationFailed'))
          return {
            httpCode: httpCode.BAD_REQUEST,
            path: 'users/new',
            req
          }
        }
      }
    } catch (error) {
      return {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        errors: [{ message: error.message }]
      }
    }
  },
  update: async (req) => {
    try {
      const { userId } = req.params
      const body = req.body

      const service = await UserModel.findOneAndUpdate(
        {
          _id: userId
        },
        { ...body, isAiEnabled: body?.isAiEnabled || false },
        {
          returnDocument: true,
          returnOriginal: false,
          new: true
        }
      )
      if (service) {
        req.flash('success', req.t('successUpdatingUser'))
        return { httpCode: httpCode.OK, path: userId, req }
      } else {
        req.flash('error', req.t('errorUpdatingUser'))
        return {
          httpCode: httpCode.BAD_REQUEST,
          path: userId
        }
      }
    } catch (error) {
      return {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      }
    }
  },
  patch: async (req) => {
    try {
      const { userId } = req.params
      const body = req.body
      let user

      if (body?.password && body?.confirmPassword) {
        const password = body?.password
        const confirmPassword = body.confirmPassword

        if (password.length >= 8 && confirmPassword.length >= 8) {
          if (password === confirmPassword) {
            const hashedPassword = await bcryptHelper.generate(body?.password)
            user = await UserModel.findOneAndUpdate(
              {
                _id: userId
              },
              {
                password: hashedPassword
              },
              {
                returnDocument: true,
                returnOriginal: false,
                new: true
              }
            )
          } else {
            req.flash('error', req.t('errorUpdatingPassword'))
            return {
              httpCode: httpCode.BAD_REQUEST,
              path: userId
            }
          }
        } else {
          req.flash('error', req.t('passwordError'))
          return {
            httpCode: httpCode.BAD_REQUEST,
            path: userId
          }
        }
      }
      if (user) {
        req.flash('success', req.t('successUpdatePassword'))
        return { httpCode: httpCode.OK, path: userId, req }
      } else {
        req.flash('error', req.t('errorUpdating'))
        return {
          httpCode: httpCode.BAD_REQUEST,
          path: userId
        }
      }
    } catch (error) {
      return {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      }
    }
  },
  block: async (req) => {
    try {
      const { userId } = req.params

      const updateValues = {
        isDeleted: req?.body?.isCommunityBlocked || false
      }

      const blockUser = await UserModel.findOneAndUpdate(
        { _id: userId },
        updateValues,
        {
          returnDocument: 'after',
          new: true
        }
      )
      if (blockUser) {
        req.flash('success', req.t('successUpdatingUser'))
        return { httpCode: httpCode.OK, path: `/admin/users/${userId}`, req }
      } else {
        req.flash('error', req.t('errorUpdatingUser'))
        return {
          httpCode: httpCode.BAD_REQUEST,
          path: `/admin/users/${userId}`,
          req
        }
      }
    } catch (error) {
      return {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      }
    }
  },
  delete: async (req) => {
    try {
      const { userId } = req.params
      const body = req.body
      const service = await UserModel.findOneAndUpdate({ _id: userId }, body, {
        returnDocument: true,
        returnOriginal: false,
        new: true
      })

      if (service) {
        req.flash('success', req.t('successDeletingUser'))
        return { httpCode: httpCode.OK, path: userId, req }
      } else {
        req.flash('error', req.t('errorDeletingUser'))
        return {
          httpCode: httpCode.BAD_REQUEST,
          path: userId,
          req
        }
      }
    } catch (error) {
      return {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      }
    }
  },
  searchAgent: async (req) => {
    try {
      const query = req?.query

      const value = decodeURIComponent(query.value.trim())
      if (value === '' || !value) {
        return { error: req.t('noEntityFound') }
      }

      const users = await UserModel.aggregate([
        {
          $match: {
            $or: [
              { firstName: { $regex: value, $options: 'i' } },
              { lastName: { $regex: value, $options: 'i' } },
              { email: { $regex: value, $options: 'i' } }
            ]
          }
        },
        {
          $lookup: {
            from: 'roles',
            let: { roleId: '$roleId' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$_id', '$$roleId'] },
                  name: ApplicationRoles.agent
                }
              }
            ],
            as: 'roleInfo'
          }
        },
        { $match: { 'roleInfo.0': { $exists: true } } },
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            countryCode: 1,
            contactNumber: 1,
            email: 1
          }
        }
      ])

      if (users.length > 0) {
        return users
      } else return { error: req.t('noEntityFound') }
    } catch (error) {
      return {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      }
    }
  }
}
