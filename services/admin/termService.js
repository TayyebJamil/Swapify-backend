'use strict'
const TermServiceModel = require('../../models/TermService.js')
const httpCode = require('../../utils/httpCodes.js')
const termSerializer = require('../../Serializer/policy.serializer.js')
const ObjectId = require('mongodb').ObjectId
const UnescapeService = require('../../utils/unescape.js')

module.exports = {
  list: async () => await TermServiceModel.find().sort({ createdAt: -1 }),
  new: async (req) => {
    try {
      return {
        httpCode: httpCode.OK,
        path: 'TermService/new'
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
      const content = await TermServiceModel.create(body)
      if (content) {
        req.flash('success', req.t('successCreateTerm'))
        return { httpCode: httpCode.OK, path: 'termServices', req }
      } else {
        req.flash('error', req.t('errorCreatingTerm'))
        return {
          httpCode: httpCode.BAD_REQUEST,
          path: 'termServices/new',
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
      const content = await TermServiceModel.findOne({
        _id: new ObjectId(id)
      })

      content.details = UnescapeService.unescapeText(content?.details)

      if (content?._id) {
        return {
          httpCode: httpCode.OK,
          resources: termSerializer.serialize(content),
          path: 'TermService/show'
        }
      } else {
        req.flash('error', req.t('nodetailsServices'))
        return {
          httpCode: httpCode.BAD_REQUEST,
          data: {
            path: 'TermService/list'
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

      const content = await TermServiceModel.findOneAndUpdate(
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
        req.flash('success', req.t('successUpdatingTerm'))
        return { httpCode: httpCode.OK, path: id, req }
      } else {
        req.flash('error', req.t('errorUpdatingTerm'))
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
      const alreadyPublished = await TermServiceModel.findOne({
        isPublished: true
      })
      if (alreadyPublished && body?.isPublished === 'true') {
        req.flash('error', req.t('alreadyPublishedTerm'))
        return {
          httpCode: httpCode.BAD_REQUEST,
          path: id
        }
      }
      const content = await TermServiceModel.findOneAndUpdate(
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
        req.flash('success', req.t('successUpdatingTerm'))
        return { httpCode: httpCode.OK, path: id, req }
      } else {
        req.flash('error', req.t('errorUpdatingTerm'))
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
    const content = await TermServiceModel.deleteOne({ _id: id })
    if (content) {
      req.flash('success', req.t('successDeletingTerm'))
      return {
        httpCode: httpCode.OK,
        path: '/admin/termServices',
        req
      }
    } else {
      req.flash('error', req.t('errorDeletingTerm'))
      return {
        httpCode: httpCode.BAD_REQUEST,
        path: id,
        req
      }
    }
  }
}
