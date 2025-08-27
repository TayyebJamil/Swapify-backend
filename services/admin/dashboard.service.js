'use strict'
const httpCode = require('../../utils/httpCodes')

module.exports = {
  list: async () => {
    try {
      return {
        httpCode: httpCode.OK,
        resources: [],
        path: 'index'
      }
    } catch (error) {
      return {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      }
    }
  }
}
