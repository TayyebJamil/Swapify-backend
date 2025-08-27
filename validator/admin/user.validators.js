const { validationResult, body, query, param } = require('express-validator')
const httpCodes = require('../../utils/httpCodes')
const generalResponse = require('../../utils/response')
const gender = ['male', 'female']

module.exports = {
  emails: [
    body('data.attributes.emails.*', 'Emails is set of emails')
      .not()
      .isArray()
      .isEmail()
  ],
  userId: [
    param('userId', 'userId Id is Mandatory')
      .not()
      .isEmpty()
      .isMongoId()
      .escape()
  ],
  create: [
    body('firstName', 'First Name is Mandotry ').not().isEmpty().isString(),
    body('lastName', 'Last Name is Mandotry ').not().isEmpty().isString(),
    body('email', 'Email is Mandatory Or Invalid Email').isEmail(),
    body('password', 'Password is must have atleast 8')
      .not()
      .isEmpty()
      .isString(),
    body('gender', 'Gender is Mandatory')
      .not()
      .isEmpty()
      .isString()
      .escape()
      .custom((value, { req }) => {
        if (!gender.includes(value)) throw new Error(req.t('invalidGender'))
        return true
      })
  ],
  update: [
    body('firstName', 'First Name is Mandotry ').not().isEmpty(),
    body('email', 'Email is Mandatory Or Invalid Email').not().isEmpty()
  ],
  show: [
    query('userId', 'User Id is Mandortry Or Invalid')
      .not()
      .isEmpty()
      .isMongoId()
  ],
  delete: [
    body('userId', 'User Id is Mandortry Or Invalid')
      .not()
      .isEmpty()
      .isMongoId()
  ],
  patch: [
    body('body?.password', 'Password should be 8 character')
      .optional()
      .isString()
      .isLength({ min: 8 }),
    body('body?.confirmPassword', 'Confirm Password should min 8')
      .optional()
      .isString()
      .isLength({ min: 8 })
      .custom((value, { req }) => {
        if (value !== req.body.password)
          throw new Error(req.t('passwordConfirmationDetails'))
        return true
      })
  ],
  /****
   *
   *
   *
   *    Validators
   *
   *
   *
   *
   */
  validate: async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      errors.errors.forEach((error) => {
        req.flash('error', req.t(error.msg))
      })
      generalResponse.redirect(req, res, {
        httpCodes: httpCodes.BAD_REQUEST,
        path: req.headers.referer,
        req
      })
    } else next()
  }
}
