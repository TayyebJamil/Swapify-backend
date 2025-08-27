'use strict'
const UserModel = require('../../../models/User')

module.exports = {
  panelLogin: async (email, role) => {
    try {
      // TODO: Implement role-based login when Role model is available
      const user = await UserModel.findOne({ email })

      if (user?._id) return user
      else return null
    } catch (error) {
      return null
    }
  },
  tempCode: async () => {
    try {
      const generateRandomCodeAndTime = () => {
        const tempCode = Math.floor(100000 + Math.random() * 900000)

        const codeCreationTime = new Date()
        codeCreationTime.setMinutes(codeCreationTime.getMinutes() + 10)
        return { tempCode, codeCreationTime }
      }

      let tempCode
      let codeCreationTime

      do {
        const { tempCode: newCode, codeCreationTime: newTime } =
          generateRandomCodeAndTime()
        tempCode = newCode
        codeCreationTime = newTime

        const duplicateCode = await UserModel.find({ code: tempCode })

        if (duplicateCode.length === 0) {
          break
        }
      } while (true)

      return {
        tempCode,
        codeCreationTime
      }
    } catch (error) {
      return null
    }
  }
}
