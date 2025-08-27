'use strict'
const router = require('express').Router()
const APIRoutes = require('./api/v1/user/router')

/***
 * Setting the routes
 */
router.use('/', APIRoutes)

module.exports = router
