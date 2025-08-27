'use strict'
const UserModel = require('../../../../models/User')
const ErrorSerializer = require('../../../../Serializer/error.serializer')
const httpCodes = require('../../../../utils/httpCodes')
const ObjectId = require('mongodb').ObjectId

module.exports = {
  show: async (req) => {
    try {
      const { userId } = req?.params

      const usersData = await UserModel.aggregate([
        {
          $match: {
            _id: new ObjectId(userId)
          }
        },
        {
          $lookup: {
            from: 'follows',
            let: { userId: '$_id', followerId: new ObjectId(req?.token?._id) },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$followedUserId', '$$userId'] },
                      { $eq: ['$followerId', '$$followerId'] }
                    ]
                  }
                }
              }
            ],
            as: 'follow'
          }
        }
      ])

      const user = usersData[0]

      if (user?._id) {
        return {
          httpCode: httpCodes.OK,
          data: {
            ...user
          }
        }
      } else
        return {
          httpCode: httpCodes.NO_CONTENT,
          ...ErrorSerializer.error(httpCodes.NO_CONTENT, req.originalUrl)
        }
    } catch (error) {
      return {
        httpCode: httpCodes.INTERNAL_SERVER_ERROR,
        errors: [{ message: error.message }]
      }
    }
  }
}
