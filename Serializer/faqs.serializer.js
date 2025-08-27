const JSONAPISerializer = require('jsonapi-serializer').Serializer
module.exports = new JSONAPISerializer('faqs', {
  attributes: [
    'question',
    'answer',
    'isDeleted',
    'published',
    'isDeleteReason',
    'onHold',
    'type',
    'onHoldReason',
    'isBlock',
    'blockedReason',
    'createdAt',
    'updatedAt',
    '_id',
    'contentsections'
  ],
  pluralizeType: false,
  id: '_id',
  keyForAttribute: 'camelCase'
})
