'use strict'

const router = require('express').Router()
const TermServiceController = require('../../controller/admin/termService.js')
const policyValidator = require('../../validator/admin/policy.js')

router.get('/', TermServiceController.list)
router.get('/new', TermServiceController.new)
router.put(
  '/:id',
  policyValidator.Id,
  policyValidator.update,
  TermServiceController.update
)
router.get(
  '/:id',
  policyValidator.Id,
  policyValidator.validate,
  TermServiceController.show
)

router.patch(
  '/:id',
  policyValidator.Id,
  policyValidator.validate,
  TermServiceController.patch
)
router.delete(
  '/:id',
  policyValidator.Id,
  policyValidator.validate,
  TermServiceController.delete
)
router.post(
  '/',
  policyValidator.create,
  policyValidator.validate,
  TermServiceController.create
)

module.exports = router
