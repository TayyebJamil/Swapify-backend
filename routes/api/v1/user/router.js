'use strict'
const router = require('express').Router()
const RegistrationRoute = require('./registration.routes')
const AuthRoute = require('./authentication.routes')
const FaqsRoutes = require('./faqs.routes')
const PrivacyPolicy = require('./privacyPolicy.routes')
const TermService = require('./termServices.routes')
const Users = require('./users.routes')

router.use('/auth', AuthRoute)
router.use('/register', RegistrationRoute)
router.use('/faqs', FaqsRoutes)
router.use('/privacyPolicies', PrivacyPolicy)
router.use('/termServices', TermService)
router.use('/users', Users)

module.exports = router
