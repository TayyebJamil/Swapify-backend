'use strict'
const express = require('express')
const router = express.Router()
const TokenValidator = require('../../../../middleware/auth')
const Controller = require('../../../../controller/api/v1/user/users.controller')



/**
 * @swagger
 * /api/v1/users/{userId}:
 *  get:
 *    tags:
 *      - User Profile
 *    security:
 *      - BearerAuthentication : []
 *    description: Get Post details
 *    parameters:
 *      - name: userId
 *        description: Id of the user.
 *        in: path
 *        type: string
 *        schema:
 *          type: string
 *          maximum: 50
 *          example: 64ecaeaa218f027feda1dae5
 *    responses:
 *      200:
 *        description: Success
 */

router.get('/:userId', TokenValidator, Controller.show)

/**
 * @swagger
 * /api/v1/users/{userId}/activity:
 *  get:
 *    tags:
 *      - User Profile
 *    security:
 *      - BearerAuthentication : []
 *    description: Get Post details
 *    parameters:
 *      - in: query
 *        name: pageNumber
 *        schema:
 *          type: integer
 *          default: 1
 *        description: Page number for pagination
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *          default: 10
 *        description: Number of post per page
 *      - in: query
 *        name: types
 *        schema:
 *          type: string
 *          default: 10
 *        description: type of post
 *      - name: userId
 *        description: Id of the user.
 *        in: path
 *        type: string
 *        schema:
 *          type: string
 *          maximum: 50
 *          example: 64ecaeaa218f027feda1dae5
 *    responses:
 *      200:
 *        description: Success
 */

router.get('/:userId/activity', TokenValidator, Controller.activity)



module.exports = router
