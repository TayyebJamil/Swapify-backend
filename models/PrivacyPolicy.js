'use strict'
const mongoose = require('mongoose')
const PrivacyPolicySchema = new mongoose.Schema(
  {
    details: {
      type: String,
      required: true
    },
    isPublished: {
      type: Boolean,
      default: false,
      required: true
    },
    createdAt: {
      type: Date
    },
    updatedAt: {
      type: Date
    }
  },
  { timestamps: true, toJSON: { getters: true, virtuals: true } },
  { versionKey: false }
)
module.exports = mongoose.model('PrivacyPolicy', PrivacyPolicySchema)
