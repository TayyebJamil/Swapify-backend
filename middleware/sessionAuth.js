module.exports = {
  isUserLogin: (req, res, next) => {
    if (req.isAuthenticated()) {
      next()
    } else {
      const admin = req?.baseUrl.includes('admin')
      if (admin) res.redirect('/')
      else res.redirect('/')
    }
  },
  isAdmin: (req, res, next) => {
    if (req.user.roleName === 'admin') {
      next()
    }
  },
  isAdminAndAgent: (req, res, next) => {
    if (req.user.roleName === 'admin' || req.user.roleName === 'agent') {
      next()
    }
  }
}
