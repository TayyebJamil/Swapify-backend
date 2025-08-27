const JSONAPISerializer = require('jsonapi-serializer').Serializer
module.exports = new JSONAPISerializer('registration', {
  attributes: [
    'authToken',
    'firstName',
    'lastName',
    'companyName',
    'image',
    'companyAddress',
    'roleId',
    'socialAuth',
    'isAiEnabled',
    'email',
    'contactNumber',
    'countryCode',
    'hasSubscribedStripe',
  ],
  pluralizeType: false,
  id: '_id',
  keyForAttribute: 'camelCase'
})
