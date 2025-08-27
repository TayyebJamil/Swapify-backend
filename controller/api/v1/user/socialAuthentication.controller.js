'use strict'
const AuthService = require('../../../../services/api/v1/user/socialAuthentication.service.js')
const httpCode = require('../../../../utils/httpCodes')
const { responses } = require('../../../../utils/response')

module.exports = {
  google: async (req, res) => {
    try {
      const body = req?.body?.data?.attributes
      const user = await AuthService.google(req, body)
      responses(res, user)
    } catch (error) {
      responses(res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        errors: [{ message: error.message }]
      })
    }
  }
}
