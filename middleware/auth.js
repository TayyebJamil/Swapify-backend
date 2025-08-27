const jwt = require('jsonwebtoken')
const { responses } = require('../utils/response')
const httpCode = require('../utils/httpCodes')
const ErrorSerializer = require('../Serializer/error.serializer')

module.exports = (req, res, next) => {
  const authorizationHeaders =
    req.headers.authorization || req.headers.Authorization
  const jwtToken = authorizationHeaders
    ? `${authorizationHeaders}`.split('Bearer ')[1]
    : ''
  if (!jwtToken) {
    responses(res, {
      httpCode: httpCode.UNAUTHORIZED,
      ...ErrorSerializer.error(
        httpCode.UNAUTHORIZED,
        req.originalUrl,
        req.t('No_Access_Token'),
        req.t('No_Access_TokenDetails')
      )
    })
  } else {
    jwt.verify(jwtToken, process.env.TOKEN_KEY, async (err, decoded) => {
      if (err) {
        responses(res, {
          httpCode: httpCode.UNAUTHORIZED,
          ...ErrorSerializer.error(
            httpCode.UNAUTHORIZED,
            req.originalUrl,
            req.t('Invalid_Access_Token'),
            req.t('Invalid_Access_TokenDetails')
          )
        })
        res.end()
      } else {
        req.token = decoded
        next()
      }
    })
  }
}
