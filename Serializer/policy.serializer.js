const JSONAPISerializer = require('jsonapi-serializer').Serializer
module.exports = new JSONAPISerializer('termAndConditions', {
  attributes: ['details', 'createdAt', 'isPublished', 'updatedAt', '_id'],
  pluralizeType: false,
  id: '_id',
  keyForAttribute: 'camelCase'
})
