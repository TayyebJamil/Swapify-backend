const router = require('express').Router()
const Controller = require('../../../../controller/api/v1/user/privacyPolicy.js')

/**
 * @swagger
 * /api/v1/privacyPolicies:
 *  get:
 *    tags:
 *      - Privacy Policy
 *    description: Get Privacy Policy
 *    responses:
 *      200:
 *        description: Success
 */

router.get('/', Controller.list)

module.exports = router
