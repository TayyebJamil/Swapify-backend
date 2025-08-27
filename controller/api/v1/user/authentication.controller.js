'use strict'
const AuthService = require('../../../../services/api/v1/user/authentication.service')
const httpCode = require('../../../../utils/httpCodes')
const { responses } = require('../../../../utils/response')

module.exports = {
  login: async (req, res) => {
    try {
      const body = req?.body?.data?.attributes
      const user = await AuthService.login(req, body)
      responses(res, user)
    } catch (error) {
      responses(res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        errors: [{ message: error.message }]
      })
    }
  },
  patch: async (req, res) => {
    try {
      const body = req?.body?.data?.attributes
      const user = await AuthService.patch(req, body)
      responses(res, user)
    } catch (error) {
      responses(res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        errors: [{ message: error.message }]
      })
    }
  },
  token: async (req, res) => {
    try {
      const { code } = req.params
      const data = await AuthService.token(req, code)
      responses(res, data)
    } catch (error) {
      responses(res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        errors: [{ message: error.message }]
      })
    }
  },
  update: async (req, res) => {
    try {
      const { newPassword } = req.body.data.attributes
      const data = await AuthService.update(req?.token, newPassword, req)
      responses(res, data)
    } catch (error) {
      responses(res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        errors: [{ message: error.message }]
      })
    }
  },
  reset: async (req, res) => {
    try {
      const data = await AuthService.reset(req)
      responses(res, data)
    } catch (error) {
      responses(res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        errors: [{ message: error.message }]
      })
    }
  }
}
