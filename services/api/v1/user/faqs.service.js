'use strict'
const FAQsModel = require('../../../../models/FAQs')
const FAQsSerializer = require('../../../../Serializer/faqs.serializer')
const httpCode = require('../../../../utils/httpCodes')

module.exports = {
  list: async (req) => {
    try {
      const data = await FAQsModel.find({
        isDeleted: false,
        published: true
      }).select('question answer updatedAt')
      if (data?.length > 0) {
        return {
          httpCode: httpCode.OK,
          data: {
            ...FAQsSerializer.serialize(data)
          }
        }
      } else
        return {
          httpCode: httpCode.NO_CONTENT,
          data: {}
        }
    } catch (error) {
      return {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        errors: [{ message: error.message }]
      }
    }
  }
}
