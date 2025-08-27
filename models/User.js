'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema(
  {
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false
    },
    firstName: {
      type: String,
      required: true
    },
    socialAuth: {
      type: Boolean,
      required: false,
      default: false
    },
    lastName: {
      type: String,
      required: true
    },
    phoneNo: {
      type: String,
      required: false
    },
    phoneNumber: {
      type: String,
      required: false
    },
    userName: {
      type: String,
      required: false
    },
    companyName: {
      type: String,
      default: '',
      required: false
    },
    companyAddress: {
      type: String,
      default: '',
      required: false
    },
    countryCode: {
      type: String,
      required: false,
      default: ''
    },
    contactNumber: {
      type: String,
      required: false
    },
    image: {
      type: String,
      required: false
    },
    coverImage: {
      type: String,
      required: false
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: false
    },
    qualifications: {
      type: String,
      required: false
    },
    pastPerformance: { type: [Object], required: false },
    certifications: { type: String, required: false },
    subcontractor: {
      // maintaining user history to prefil solicitations form
      business: { type: String, required: false },
      state: { type: String, required: false },
      address: { type: String, required: false },
      workForce: { type: String, required: false }
    },
    queries: {
      // maintaining user history to prefil solicitations form
      type: [
        {
          question: { type: String },
          answer: { type: String }
        }
      ],
      required: false,
      default: []
    },
    passwordChangedRequest: {
      type: Boolean,
      default: false,
      required: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
      required: true
    },
    code: {
      type: String,
      required: false,
      default: ''
    },
    codeCreationTime: {
      type: String,
      required: false,
      default: ''
    },
    createdAt: {
      type: Date
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true
    },
    isAiEnabled: {
      type: Boolean,
      default: false,
      required: true
    },
    updatedAt: {
      type: Date
    },
    about: {
      type: String,
      required: false
    },
    stripeCustomerId: {
      type: String,
      required: false
    },
    bio: {
      type: String,
      required: false
    }
  },
  { timestamps: true, toJSON: { getters: true, virtuals: true } },
  { versionKey: false }
)

userSchema.index({ firstName: 1, email: 1, type: -1 })

module.exports = mongoose.models.User || mongoose.model('User', userSchema)
