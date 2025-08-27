'use strict'
const httpCode = require('../../utils/httpCodes')
const nodemailer = require('nodemailer')

module.exports = {
  send: async (sendTo, subject, body) => {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.smtpHost,
        port: process.env.smtpPort,
        secure: process.env.smtpSecure,
        auth: {
          user: process.env.smtpUser,
          pass: process.env.smtpPass
        }
      })
      transporter.sendMail({
        from: process.env.smtpSender,
        to: sendTo,
        subject,
        html: body
      })
    } catch (error) {
      return {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        errors: [{ message: error.response.body }]
      }
    }
  }
}
