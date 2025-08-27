const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const UserHelper = require('../../helper/api/v1/user.helper')
const bcryptHelper = require('../../utils/bcrypt.helper')
const ApplicationRoles = require('../../config/role')

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((id, done) => {
  return done(null, id)
})

passport.use(
  'local-login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    authenticateLogin
  )
)

// eslint-disable-next-line space-before-function-paren
async function authenticateLogin(req, email, password, done) {
  try {
    let adminLogin = await UserHelper.panelLogin(email, ApplicationRoles?.admin)
    if (adminLogin == null) {
      adminLogin = await UserHelper.panelLogin(email, ApplicationRoles?.agent)
    }
    if (adminLogin?._id) {
      if (!(await bcryptHelper.compare(password, adminLogin.password))) {
        return done(null, { status: false, message: req.t('invalidPassword') })
      } else {
        adminLogin.roleName = adminLogin?.roleId?.name
        delete adminLogin.password
        return done(null, {
          status: true,
          message: req.t('login-success'),
          ...adminLogin
        })
      }
    } else {
      return done(null, { status: false, message: req.t('noUserFound') })
    }
  } catch (error) {
    return done(null, { status: false, message: req.t(error) })
  }
}

module.exports = passport
