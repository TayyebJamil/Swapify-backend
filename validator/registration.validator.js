const { validationResult, check, body } = require('express-validator')
const { responses } = require('../utils/response')
const ErrorSerializer = require('../Serializer/error.serializer')
const httpCodestatus = require('../utils/httpCodes')
// const { phone } = require('phone')

module.exports = {
  body: [
    body('data.attributes.firstName', 'First Name is Mandatory ')
      .not()
      .isEmpty(),
    body('data.attributes.lastName', 'Last Name is Mandatory ').not().isEmpty(),
    body('data.attributes.companyName', 'Company Name is Mandatory ')
      .not()
      .isEmpty(),
    check('data.attributes.email', 'Email is Mandatory Or Invalid Email')
      .not()
      .isEmpty()
      .isEmail(),
    // check('data.attributes.contactNumber', 'Contact Number is In Valid')
    //   .optional()
    //   .isString()
    //   .custom((value, { req }) => {
    //     const number = phone(value, {
    //       validateMobilePrefix: true,
    //       strictDetection: false
    //     })
    //     if (!number?.isValid) throw new Error(req.t('contactNumberError'))
    //     return true
    //   }),
    body('data.attributes.password', 'Password should be min 8')
      .not()
      .isEmpty()
      .isString()
      .isLength({ min: 8 }),
    body('data.attributes.confirmPassword', 'Confirm Password should be min 8')
      .not()
      .isEmpty()
      .not()
      .isEmpty()
      .isString()
      .isLength({ min: 8 })
      .custom((value, { req }) => {
        if (value !== req.body.data.attributes.password)
          throw new Error('Password confirmation does not match password')
        return true
      })
  ],
  validate: async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      responses(res, {
        httpCode: httpCodestatus.UNPROCESSABLE_ENTITY,
        ...ErrorSerializer.error(
          httpCodestatus.UNPROCESSABLE_ENTITY,
          req.originalUrl,
          errors.array()
        )
      })
    } else next()
  }
}
