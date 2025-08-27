'use strict'
const router = require('express').Router()
const Controller = require('../../../../controller/api/v1/user/registration.controller.js')
const Validator = require('../../../../validator/registration.validator')
/**
 * @swagger
 * /api/v1/register:
 *  post:
 *    tags:
 *      - Registration
 *    description: Register User Route
 *    parameters:
 *      - in: body
 *        name: body
 *        description: User registration payload
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            data:
 *              type: object
 *              properties:
 *                attributes:
 *                  type: object
 *                  properties:
 *                    firstName:
 *                      type: string
 *                      required: true
 *                      example: Sample
 *                    lastName:
 *                      type: string
 *                      required: true
 *                      example: Sample
 *                    companyName:
 *                      type: string
 *                      required: true
 *                      example: Sample Company
 *                    email:
 *                      type: string
 *                      required: true
 *                      example: sample@gmail.com
 *                    password:
 *                      type: string
 *                      required: true
 *                      example: Password@123
 *                    confirmPassword:
 *                      type: string
 *                      required: true
 *                      example: Password@123
 *                    role:
 *                      type: string
 *                      required: true
 *                      example: subcontractor
 *    responses:
 *      201:
 *        description: Registration successful
 *      400:
 *        description: Validation error or duplicate entry
 *      500:
 *        description: Internal server error
 */
router.post('/', Validator.body, Validator.validate, Controller.register)

module.exports = router
