const JSONAPISerializer = require('jsonapi-serializer').Serializer
module.exports = new JSONAPISerializer('user', {
  attributes: [
    'firstName',
    'lastName',
    'image',
    'coverImage',
    'email',
    'queries',
    'subcontractor',
    'gender',
    'socialAuth',
    'follow',
    'isDeleted',
    'isAiEnabled',
    'createdAt',
    'about',
    'bio'
  ],
  pluralizeType: false,
  id: '_id',
  keyForAttribute: 'camelCase'
})
