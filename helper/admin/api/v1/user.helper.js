'use strict'
const UserModel = require('../../../models/User')
const httpCode = require('../../../utils/httpCodes')

module.exports = {
  role: async (email, role) => {
    try {
      const users = await UserModel.aggregate([
        {
          $match: {
            email
          }
        },
        {
          $project: {
            email: 1,
            fullName: 1,
            notificationEnable: 1,
            emailEnabale: 1
          }
        },
        {
          $lookup: {
            from: 'userroles',
            let: { userId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$userId', '$$userId']
                  }
                }
              },
              {
                $lookup: {
                  from: 'roles',
                  let: { roleId: '$roleId' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$_id', '$$roleId']
                        }
                      }
                    },
                    {
                      $project: {
                        name: 1
                      }
                    }
                  ],
                  as: 'roleId'
                }
              }
            ],
            as: 'userroles'
          }
        },
        { $sort: { createdAt: -1 } }
      ])

      const check = users.find((user) => {
        const matchingRole = user.userroles.find(
          (item) => item?.roleId?.length > 0 && item?.roleId[0]?.name === role
        )
        return matchingRole !== undefined
      })

      if (check) {
        return {
          _id: users[0]?._id,
          email: users[0]?.email,
          fullName: users[0]?.fullName,
          notificationEnable: users[0]?.notificationEnable,
          emailEnabale: users[0]?.emailEnabale,
          role
        }
      } else {
        return null
      }
    } catch (error) {
      return {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        errors: [{ message: error.message }]
      }
    }
  },
  validate: async (req, match, role) => {
    try {
      const users = await UserModel.aggregate([
        {
          $match: match
        },
        {
          $project: {
            email: 1,
            contactNumber: 1,
            isDeleted: 1,
            isCustomer: 1
          }
        },
        {
          $lookup: {
            from: 'userroles',
            let: { userId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$userId', '$$userId']
                  }
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
                        name: role
                      }
                    }
                  ],
                  as: 'roleId'
                }
              }
            ],
            as: 'userroles'
          }
        }
      ])

      const matched = users?.filter((u) => u?.userroles?.length > 0)
      if (matched?.length > 0 || users?.length > 0) {
        if (matched?.length > 0)
          return {
            _id: users[0]?._id,
            email: users[0]?.email,
            contactNumber: users[0]?.contactNumber,
            isDeleted: users[0]?.isDeleted,
            isCustomer: users[0]?.isCustomer,
            role: matched
          }
        else
          return {
            _id: users[0]?._id,
            email: users[0]?.email,
            contactNumber: users[0]?.contactNumber,
            isDeleted: users[0]?.isDeleted,
            isCustomer: users[0]?.isCustomer,
            role: false
          }
      } else return null
    } catch (error) {
      return {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        errors: [{ message: error.message }]
      }
    }
  },
  panelLogin: async (email, role) => {
    try {
      const user = await UserModel.aggregate([
        {
          $match: {
            email,
            isDeleted: false
          }
        },
        {
          $lookup: {
            from: 'userroles',
            let: { userId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$userId', '$$userId']
                  }
                }
              },
              {
                $lookup: {
                  from: 'roles',
                  let: { roleId: '$roleId' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$_id', '$$roleId']
                        },
                        name: role
                      }
                    }
                  ],
                  as: 'roleId'
                }
              }
            ],
            as: 'userroles'
          }
        },
        {
          $unwind: {
            path: '$userroles',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $redact: {
            $cond: [
              { $gt: [{ $size: '$userroles.roleId' }, 0] },
              '$$KEEP',
              '$$PRUNE'
            ]
          }
        }
      ])

      if (user?.length > 0) return user
      else return null
    } catch (error) {
      return null
    }
  }
}
