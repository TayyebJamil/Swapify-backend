'use strict'
const httpCode = require('../../utils/httpCodes')
const sendEmail = require('./sendEmail')

module.exports = {
  sendEmail: async (sendTo, subject, body) => {
    try {
      const notifications = []
      const emails = []
      sendTo.forEach((user) => {
        if (user.email) emails.push(sendEmail.send(user.email, subject, body))
      })
      await Promise.all([...notifications, ...emails])
    } catch (error) {
      return {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        errors: [{ message: error }]
      }
    }
  },
  sendEmailInvitations: async (sendTo, subject, body) => {
    try {
      const notifications = []
      const emails = []
      sendTo.forEach((user) => {
        if (user) emails.push(sendEmail.send(user, subject, body))
      })
      await Promise.all([...notifications, ...emails])
    } catch (error) {
      return {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        errors: [{ message: error }]
      }
    }
  }
}
