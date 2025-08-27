'use strict'
const router = require('express').Router()
const sessionMiddleWare = require('../middleware/sessionAuth')
const httpCodestatus = require('../utils/httpCodes')
const AdminAuthPassport = require('../config/passport/adminAuth')
const UserRoutes = require('./admin/user.routes')
const FaqsRoutes = require('./admin/faqs.routes')
const PrivacyPolicyRoutes = require('./admin/privacyPolicy.routes.js')
const TermServiceRoutes = require('./admin/termService.routes.js')

router.get('/', (req, res) => {
  const options = {
    title: 'Login',
    description: 'Page Description',
    header: 'Page Header',
    layout: '../views/layouts/session',
    error: req.flash('error'),
    success: req.flash('success')
  }
  res.render('sessions/login', options)
})

router.get('/404', (req, res) => {
  res.render('pages-error-404')
})

router.get('/500', (req, res) => {
  res.render('pages-error-500', {
    user: req.user,
    error: req.flash('error')
  })
})

router.use(
  '/users',
  sessionMiddleWare.isUserLogin,
  sessionMiddleWare.isAdmin,
  UserRoutes
)

router.use(
  '/faqs',
  sessionMiddleWare.isUserLogin,
  sessionMiddleWare.isAdmin,
  FaqsRoutes
)

router.use(
  '/privacyPolicies',
  sessionMiddleWare.isUserLogin,
  sessionMiddleWare.isAdmin,
  PrivacyPolicyRoutes
)

router.use(
  '/termServices',
  sessionMiddleWare.isUserLogin,
  sessionMiddleWare.isAdmin,
  TermServiceRoutes
)

router.post(
  '/login',
  AdminAuthPassport.authenticate('local-login'),
  (req, res) => {
    if (req.user.status) {
      if (req.user.roleName === 'agent') {
        req.flash('success', req.user.message)
        res.status(httpCodestatus.OK).redirect('/agent/tasks')
      } else {
        req.flash('success', req.user.message)
        res.status(httpCodestatus.OK).redirect('/admin/users')
      }
    } else {
      req.flash('error', req.user.message)
      res.status(httpCodestatus.BAD_REQUEST).redirect('/admin')
    }
  }
)

router.post('/signout', (req, res) => {
  try {
    req.session = null
    req.user = null
    req.logout()
    res.status(httpCodestatus.OK).redirect('/admin')
  } catch (error) {
    res.status(httpCodestatus.OK).redirect('/admin')
  }
})
router.all('*', async (req, res) => {
  if (req?.user) {
    res.redirect('/admin/users')
  } else {
    res.redirect('/admin')
  }
})
module.exports = router
