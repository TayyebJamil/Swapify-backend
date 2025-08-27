'use strict'
const router = require('express').Router()
const Controller = require('../../../../controller/api/v1/user/authentication.controller.js')
const SocialController = require('../../../../controller/api/v1/user/socialAuthentication.controller.js')
const AuthValidator = require('../../../../validator/authentication.validator')
const Validator = require('../../../../validator/registration.validator')
const TokenValidator = require('../../../../middleware/auth')

/**
 * @swagger
 * /api/v1/auth:
 *  post:
 *    tags:
 *      - Authentication
 *    description: Login User Route
 *    parameters:
 *      - description: user can login
 *        in: body
 *        name: body
 *        schema:
 *          type: object
 *          properties:
 *            data:
 *              type: object
 *              properties:
 *                attributes:
 *                  type: object
 *                  properties:
 *                     email:
 *                       type: string
 *                       required: true
 *                       example: sample@gmail.com
 *                     password:
 *                       type: string
 *                       required: true
 *                       example: Password@123
 *    responses:
 *      200:
 *        description: Success
 */
router.post('/', AuthValidator.login, Validator.validate, Controller.login)

/**
 * @swagger
 * /api/v1/auth/social/google:
 *  post:
 *    tags:
 *      - Social Authentication
 *    description: Google login
 *    parameters:
 *      - description: User can login/signup from google
 *        in: body
 *        name: body
 *        schema:
 *          type: object
 *          properties:
 *            data:
 *              type: object
 *              properties:
 *                attributes:
 *                  type: object
 *                  properties:
 *                     email:
 *                       type: string
 *                       required: true
 *                       example: dev@gmail.com
 *                     password:
 *                       type: string
 *                       required: true
 *                       example: Password@123
 *                     role:
 *                       type: string
 *                       required: true
 *                       example: player, venueOwner , talent
 *    responses:
 *      200:
 *        description: Success
 */
router.post('/social/google', SocialController.google)

/**
 * @swagger
 * /api/v1/auth:
 *  patch:
 *    tags:
 *      - Authentication
 *    description: User Forget Password
 *    parameters:
 *      - description: User can request to change the password.
 *        in: body
 *        name: body
 *        schema:
 *          type: object
 *          properties:
 *            data:
 *              type: object
 *              properties:
 *                attributes:
 *                  type: object
 *                  properties:
 *                     email:
 *                       type: string
 *                       required: true
 *                       example: example@gmail.com
 *    responses:
 *      200:
 *        description: Success
 */
router.patch('/', AuthValidator.email, Validator.validate, Controller.patch)

/**
 * @swagger
 * /api/v1/auth/{code}:
 *  get:
 *    tags:
 *      - Authentication
 *    description: User Forget Password
 *    parameters:
 *      - description: The Code which is sent to the email pasted here and it will respond with user information.
 *        in: path
 *        name: code
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Success
 */
router.get('/:code', AuthValidator.code, Validator.validate, Controller.token)

/**
 * @swagger
 * /api/v1/auth:
 *  put:
 *    tags:
 *      - Authentication
 *    security:
 *      - BearerAuthentication : []
 *    description: User Change Password
 *    parameters:
 *      - description: User can change the password.
 *        in: body
 *        name: body
 *        schema:
 *          type: object
 *          properties:
 *            data:
 *              type: object
 *              properties:
 *                attributes:
 *                  type: object
 *                  properties:
 *                     password:
 *                       type: string
 *                       required: true
 *                       example: Admin@123
 *                     newPassword:
 *                       type: string
 *                       required: true
 *                       example: Admin@123
 *                     confirmPassword:
 *                       type: string
 *                       required: true
 *                       example: Admin@123
 *    responses:
 *      200:
 *        description: Success
 */
router.put(
  '/',
  AuthValidator.changePassword,
  Validator.validate,
  TokenValidator,
  Controller.update
)

/**
 * @swagger
 * /api/v1/auth/{code}:
 *  put:
 *    tags:
 *      - Authentication
 *    security:
 *      - BearerAuthentication : []
 *    description: User can reset Password
 *    parameters:
 *      - description: The code which is sent to the email pasted here and it will respond with user information.
 *        in: path
 *        name: code
 *        schema:
 *          type: string
 *      - description: User can reset the password.
 *        in: body
 *        name: body
 *        schema:
 *          type: object
 *          properties:
 *            data:
 *              type: object
 *              properties:
 *                attributes:
 *                  type: object
 *                  properties:
 *                     newPassword:
 *                       type: string
 *                       required: true
 *                       example: Admin@123
 *                     confirmPassword:
 *                       type: string
 *                       required: true
 *                       example: Admin@123
 *    responses:
 *      200:
 *        description: Success
 */
router.put(
  '/:code',
  AuthValidator.changePassword,
  Validator.validate,
  Controller.reset
)

module.exports = router
