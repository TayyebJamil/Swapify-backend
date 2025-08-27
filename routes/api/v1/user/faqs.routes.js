'use strict'
const express = require('express')
const router = express.Router()
const Controller = require('../../../../controller/api/v1/user/faq.controller')
const Validator = require('../../../../validator/registration.validator')

/**
 * @swagger
 * /api/v1/faqs:
 *  get:
 *    tags:
 *      - FAQ
 *    description: FAQ
 *    responses:
 *      200:
 *        description: Success
 */

router.get('/', Validator.validate, Controller.list)

module.exports = router
