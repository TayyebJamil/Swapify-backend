'use strict'

const router = require('express').Router()
const PrivacyPolicyController = require('../../controller/admin/privacyPolicy.js')
const policyValidator = require('../../validator/admin/policy.js')

router.get('/', PrivacyPolicyController.list)
router.get('/new', PrivacyPolicyController.new)
router.put(
  '/:id',
  policyValidator.Id,
  policyValidator.update,
  PrivacyPolicyController.update
)
router.get(
  '/:id',
  policyValidator.Id,
  policyValidator.validate,
  PrivacyPolicyController.show
)

router.patch(
  '/:id',
  policyValidator.Id,
  policyValidator.validate,
  PrivacyPolicyController.patch
)
router.delete(
  '/:id',
  policyValidator.Id,
  policyValidator.validate,
  PrivacyPolicyController.delete
)
router.post(
  '/',
  policyValidator.create,
  policyValidator.validate,
  PrivacyPolicyController.create
)

module.exports = router
