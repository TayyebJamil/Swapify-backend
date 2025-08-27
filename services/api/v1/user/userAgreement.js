const UserAgreementModel = require('../../../../models/UserAgreement')
const AgreementSerializer = require('../../../../Serializer/policy.serializer.js')
const httpCode = require('../../../../utils/httpCodes.js')
module.exports = {
  list: async (req) => {
    try {
      const terms = await UserAgreementModel.findOne({
        isPublished: true
      })

      if (terms) {
        return {
          httpCode: httpCode.OK,
          data: {
            ...AgreementSerializer.serialize(terms)
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
