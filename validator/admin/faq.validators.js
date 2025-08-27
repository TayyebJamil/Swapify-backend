const { body, param } = require('express-validator')

module.exports = {
  faqId: param('faqId', 'FAQ Id is Mandatory || Invalid Id Type')
    .not()
    .isEmpty()
    .isMongoId(),
  create: [
    body('question', 'FAQ question is Mandatory').not().isEmpty().isString(),
    body('answer', 'FAQ answer is Mandatory').not().isEmpty().isString()
  ],
  update: [
    body('question', 'FAQ question is Mandatory').optional().isString(),
    body('answer', 'FAQ answer is Mandatory').not().isEmpty().isString()
  ]
}
