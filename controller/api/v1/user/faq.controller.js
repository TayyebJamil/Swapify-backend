'use strict'
const Service = require('../../../../services/api/v1/user/faqs.service')
const { responses } = require('../../../../utils/response')
const httpCodes = require('../../../../utils/httpCodes')
module.exports = {
  list: async (req, res) => {
    try {
      const data = await Service.list(req)
      responses(res, data)
    } catch (error) {
      responses(res, {
        httpCode: httpCodes.INTERNAL_SERVER_ERROR,
        errors: [{ message: error.message }]
      })
    }
  }
}
