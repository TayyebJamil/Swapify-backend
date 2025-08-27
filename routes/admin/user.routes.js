'use strict'
const router = require('express').Router()
const UserController = require('../../controller/admin/user.controller')
const UserValidator = require('../../validator/admin/user.validators')

router.get('/', UserController.list)
router.post(
  '/',
  UserValidator.create,
  UserValidator.validate,
  UserController.create
)

router.get('/new', UserController.new)

router.get('/:userId', UserController.show)

router.put(
  '/:userId',
  UserValidator.userId,
  UserValidator.update,
  UserValidator.validate,
  UserController.update
)

router.patch(
  '/:userId',
  UserValidator.userId,
  UserValidator.patch,
  UserValidator.validate,
  UserController.patch
)

router.patch(
  '/:userId/block',
  UserValidator.userId,
  UserValidator.validate,
  UserController.block
)

router.delete(
  '/:userId',
  UserValidator.userId,
  UserValidator.validate,
  UserController.delete
)

router.delete(
  '/:userId',
  UserValidator.userId,
  UserValidator.validate,
  UserController.delete
)

router.get('/search/agent', UserController.searchAgent)

module.exports = router
