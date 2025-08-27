'use strict'

const router = require('express').Router()
const ContentController = require('../../controller/admin/faqs.controller')
const FAQValidator = require('../../validator/admin/faq.validators')
const Validator = require('../../validator/admin/user.validators')

router.get('/', ContentController.list)
router.get('/new', ContentController.new)
router.put(
  '/:faqId',
  FAQValidator.faqId,
  FAQValidator.update,
  ContentController.update
)
router.get(
  '/:faqId',
  FAQValidator.faqId,
  Validator.validate,
  ContentController.show
)

router.patch(
  '/:faqId',
  FAQValidator.faqId,
  Validator.validate,
  ContentController.patch
)
router.delete(
  '/:faqId',
  FAQValidator.faqId,
  Validator.validate,
  ContentController.delete
)
router.post(
  '/',
  FAQValidator.create,
  Validator.validate,
  ContentController.create
)

module.exports = router
