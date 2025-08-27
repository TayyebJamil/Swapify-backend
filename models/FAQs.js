'use strict'
const mongoose = require('mongoose')
const FaqsSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    published: {
      type: Boolean,
      default: true,
      required: true
    },

    isDeleted: {
      type: Boolean,
      default: false,
      required: true
    },
    isDeleteReason: {
      type: String,
      default: ''
    },
    onHold: {
      type: Boolean,
      default: false,
      required: true
    },
    onHoldReason: {
      type: String,
      default: ''
    },
    isBlock: {
      type: Boolean,
      default: false,
      required: true
    },
    blockedReason: {
      type: String,
      default: ''
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
module.exports = mongoose.model('faqs', FaqsSchema)
// FaqsSchema.eachPath(function (path) {
//   console.log(path)
// })
