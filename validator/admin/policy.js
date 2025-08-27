const { validationResult, body, param } = require('express-validator')
const { redirect } = require('../../utils/response')
const httpCodes = require('../../utils/httpCodes')

module.exports = {
  policyId: param('policyId', 'Policy Id is Mandatory || Invalid Id Type')
    .not()
    .isEmpty()
    .isMongoId(),
  Id: param('id', 'Id is Mandatory || Invalid Id Type')
    .not()
    .isEmpty()
    .isMongoId(),
  create: [body('details', 'Details is Mandatory').not().isEmpty().isString()],
  update: [body('details', 'Details is Mandatory').not().isEmpty().isString()],
  validate: async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      errors.errors.forEach((error) => {
        req.flash('error', req.t(error.msg))
      })
      redirect(req, res, {
        httpCodes: httpCodes.BAD_REQUEST,
        path: req.headers.referer,
        req
      })
    } else next()
  }
}
