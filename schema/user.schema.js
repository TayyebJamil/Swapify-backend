const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

module.exports = {
  validate: Joi.object({
    userId: Joi.objectId().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required()
  })
}
