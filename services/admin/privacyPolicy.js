'use strict'
const PrivacyPolicyModel = require('../../models/PrivacyPolicy')
const httpCode = require('../../utils/httpCodes.js')
const privacyPolicySerializer = require('../../Serializer/policy.serializer.js')
const ObjectId = require('mongodb').ObjectId
const UnescapeService = require('../../utils/unescape.js')

module.exports = {
  list: async () => await PrivacyPolicyModel.find().sort({ createdAt: -1 }),
  new: async (req) => {
    try {
      return {
        httpCode: httpCode.OK,
        path: 'PrivacyPolicy/new'
      }
    } catch (error) {
      return {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      }
    }
  },
  create: async (req) => {
    try {
      const body = req.body
      const content = await PrivacyPolicyModel.create(body)
      if (content) {
        req.flash('success', req.t('successCreatePolicy'))
        return { httpCode: httpCode.OK, path: 'privacyPolicies', req }
      } else {
        req.flash('error', req.t('errorCreatingPolicy'))
        return {
          httpCode: httpCode.BAD_REQUEST,
          path: 'privacyPolicies/new',
          req
        }
      }
    } catch (error) {
      return {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500',
        req
      }
    }
  },
  show: async (req) => {
    try {
      const { id } = req.params
      const content = await PrivacyPolicyModel.findOne({
        _id: new ObjectId(id)
      })

      content.details = UnescapeService.unescapeText(content?.details)

      if (content?._id) {
        return {
          httpCode: httpCode.OK,
          resources: privacyPolicySerializer.serialize(content),
          path: 'PrivacyPolicy/show'
        }
      } else {
        req.flash('error', req.t('nodetailsServices'))
        return {
          httpCode: httpCode.BAD_REQUEST,
          data: {
            path: 'PrivacyPolicy/list'
          }
        }
      }
    } catch (error) {
      return {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      }
    }
  },
  update: async (req) => {
    try {
      const { id } = req.params
      const body = req.body

      const content = await PrivacyPolicyModel.findOneAndUpdate(
        {
          _id: id
        },
        body,
        {
          returnDocument: true,
          returnOriginal: false,
          new: true
        }
      )
      if (content) {
        req.flash('success', req.t('successUpdatingPolicy'))
        return { httpCode: httpCode.OK, path: id, req }
      } else {
        req.flash('error', req.t('errorUpdatingPolicy'))
        return {
          httpCode: httpCode.BAD_REQUEST,
          path: id
        }
      }
    } catch (error) {
      return {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      }
    }
  },
  patch: async (req) => {
    try {
      const { id } = req.params
      const body = req.body
      const alreadyPublished = await PrivacyPolicyModel.findOne({
        isPublished: true
      })
      if (alreadyPublished && body?.isPublished === 'true') {
        req.flash('error', req.t('alreadyPublished'))
        return {
          httpCode: httpCode.BAD_REQUEST,
          path: id
        }
      }
      const content = await PrivacyPolicyModel.findOneAndUpdate(
        {
          _id: id
        },
        body,
        {
          returnDocument: true,
          returnOriginal: false,
          new: true
        }
      )
      if (content) {
        req.flash('success', req.t('successUpdatingPolicy'))
        return { httpCode: httpCode.OK, path: id, req }
      } else {
        req.flash('error', req.t('errorUpdatingPolicy'))
        return {
          httpCode: httpCode.BAD_REQUEST,
          path: id
        }
      }
    } catch (error) {
      return {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      }
    }
  },
  delete: async (req) => {
    const { id } = req.params
    const content = await PrivacyPolicyModel.deleteOne({ _id: id })
    if (content) {
      req.flash('success', req.t('successDeletingPolicy'))
      return {
        httpCode: httpCode.OK,
        path: '/admin/privacyPolicies',
        req
      }
    } else {
      req.flash('error', req.t('errorDeletingPolicy'))
      return {
        httpCode: httpCode.BAD_REQUEST,
        path: id,
        req
      }
    }
  }
}
