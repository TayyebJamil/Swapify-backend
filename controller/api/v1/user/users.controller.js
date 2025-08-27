'use strict'
const Services = require('../../../../services/api/v1/user/users.service')
const { responses } = require('../../../../utils/response')
const httpCodes = require('../../../../utils/httpCodes')
module.exports = {
  show: async (req, res) => {
    try {
      const services = await Services.show(req)
      responses(res, services)
    } catch (error) {
      responses(res, {
        httpCode: httpCodes.INTERNAL_SERVER_ERROR,
        errors: [{ message: error.message }]
      })
    }
  },

  activity: async (req, res) => {
    try {
      const { pageNumber, limit } = req?.query;
      const currentPage = parseInt(pageNumber, 10) || 1;
      const pageSize = parseInt(limit, 10) || 10;


      if (isNaN(currentPage) || currentPage <= 0) {
        return responses(res, {
          httpCode: httpCodes.BAD_REQUEST,
          errors: [{ message: 'Invalid page number.' }]
        });
      }
      if (isNaN(pageSize) || pageSize <= 0) {
        return responses(res, {
          httpCode: httpCodes.BAD_REQUEST,
          errors: [{ message: 'Invalid limit value.' }]
        });
      }

      const posts = await Services.activity(req, currentPage, pageSize)
      responses(res, posts)
    } catch (error) {

      responses(res, {
        httpCode: httpCodes.INTERNAL_SERVER_ERROR,
        errors: [{ message: error.message }]
      })
    }
  }
}