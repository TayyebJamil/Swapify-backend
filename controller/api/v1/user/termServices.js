const TermService = require('../../../../services/api/v1/user/termServices.js')
const httpCode = require('../../../../utils/httpCodes.js')
const { responses } = require('../../../../utils/response.js')

module.exports = {
  list: async (req, res) => {
    try {
      const terms = await TermService.list(req)
      responses(res, terms)
    } catch (error) {
      responses(res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        errors: [{ message: error.message }]
      })
    }
  }
}
