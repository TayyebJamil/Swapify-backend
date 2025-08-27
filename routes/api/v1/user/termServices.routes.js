const router = require('express').Router()
const Controller = require('../../../../controller/api/v1/user/termServices.js')

/**
 * @swagger
 * /api/v1/termServices:
 *  get:
 *    tags:
 *      - Terms Of Service
 *    description: Get term of service
 *    responses:
 *      200:
 *        description: Success
 */

router.get('/', Controller.list)

module.exports = router
