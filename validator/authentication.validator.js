const { body, param } = require('express-validator')
module.exports = {
  login: [
    body('data.attributes.email', 'Email is Mandatory Or Invalid Email')
      .not()
      .isEmpty()
      .isEmail()
  ],
  email: [
    body(
      'data.attributes.email',
      'Email is Mandatory Or Invalid Email'
    ).isEmail()
  ],
  code: [param('code', 'Code is mandatory').isString()],
  changePassword: [
    body(
      'data.attributes.newPassword',
      'Password should be min 8 , max 20 char long'
    )
      .not()
      .isEmpty()
      .isString()
      .isLength({ min: 8 }),
    body(
      'data.attributes.confirmPassword',
      'Confirm Password should be min 8 , max 20 char long'
    )
      .not()
      .isEmpty()
      .isString()
      .isLength({ min: 8 })
      .custom((value, { req }) => {
        if (value !== req.body.data.attributes.newPassword)
          throw new Error('Password confirmation does not match password')
        return true
      })
  ]
}
