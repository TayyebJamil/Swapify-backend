'use strict'
const FAQsModel = require('../../models/FAQs')
const httpCode = require('../../utils/httpCodes')
const FaqsSerializer = require('../../Serializer/faqs.serializer')
const ObjectId = require('mongodb').ObjectId

module.exports = {
  list: async () => await FAQsModel.find().sort({ createdAt: -1 }).limit(5),
  new: async (req) => {
    try {
      return {
        httpCode: httpCode.OK,
        path: 'FAQs/new'
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
      const content = await FAQsModel.create(body)
      if (content) {
        req.flash('success', req.t('successCreateFAQ'))
        return { httpCode: httpCode.OK, path: 'faqs', req }
      } else {
        req.flash('error', req.t('errorCreateFAQ'))
        return {
          httpCode: httpCode.BAD_REQUEST,
          path: 'faqs/new',
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
      const { faqId } = req.params
      const content = await FAQsModel.findOne({
        _id: new ObjectId(faqId)
      })

      if (content?._id) {
        return {
          httpCode: httpCode.OK,
          resources: FaqsSerializer.serialize(content),
          path: 'FAQs/show'
        }
      } else {
        req.flash('error', req.t('nodetailsFAQ'))
        return {
          httpCode: httpCode.BAD_REQUEST,
          data: {
            path: 'FAQs/list'
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
      const { faqId } = req.params
      const body = req.body

      const content = await FAQsModel.findOneAndUpdate(
        {
          _id: faqId
        },
        body,
        {
          returnDocument: true,
          returnOriginal: false,
          new: true
        }
      )
      if (content) {
        req.flash('success', req.t('successUpdatingFAQ'))
        return { httpCode: httpCode.OK, path: faqId, req }
      } else {
        req.flash('error', req.t('errorUpdatingFAQ'))
        return {
          httpCode: httpCode.BAD_REQUEST,
          path: faqId
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
      const { faqId } = req.params
      const body = req.body
      const content = await FAQsModel.findOneAndUpdate(
        {
          _id: faqId
        },
        body,
        {
          returnDocument: true,
          returnOriginal: false,
          new: true
        }
      )
      if (content) {
        req.flash('success', req.t('successUpdatingFAQ'))
        return { httpCode: httpCode.OK, path: faqId, req }
      } else {
        req.flash('error', req.t('errorUpdatingFAQ'))
        return {
          httpCode: httpCode.BAD_REQUEST,
          path: faqId
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
    const { faqId } = req.params
    const body = req.body
    const content = await FAQsModel.findOneAndUpdate({ _id: faqId }, body, {
      returnDocument: true,
      returnOriginal: false,
      new: true
    })
    if (content) {
      req.flash('success', req.t('successUpdatingFAQ'))
      return { httpCode: httpCode.OK, path: faqId, req }
    } else {
      req.flash('error', req.t('errorUpdatingFAQ'))
      return {
        httpCode: httpCode.BAD_REQUEST,
        path: faqId,
        req
      }
    }
  }
}
