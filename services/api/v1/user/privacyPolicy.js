const PolicyModel = require('../../../../models/PrivacyPolicy.js')
const PolicySerializer = require('../../../../Serializer/policy.serializer.js')
const httpCode = require('../../../../utils/httpCodes.js')
module.exports = {
  list: async (req) => {
    try {
      const terms = await PolicyModel.findOne({
        isPublished: true
      })

      if (terms) {
        return {
          httpCode: httpCode.OK,
          data: {
            ...PolicySerializer.serialize(terms)
          }
        }
      } else {
        return {
          httpCode: httpCode.NO_CONTENT,
          data: {}
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
