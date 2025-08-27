'use strict'
const Service = require('../../services/admin/faqs.service')
const httpCode = require('../../utils/httpCodes')
const { redirect, render } = require('../../utils/response')

module.exports = {
  list: async (req, res) => {
    try {
      const data = await Service.list()
      render(req, res, {
        httpCode: httpCode.OK,
        path: 'FAQs/list',
        resources: data
      })
    } catch (error) {
      render(req, res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      })
    }
  },
  create: async (req, res) => {
    try {
      const data = await Service.create(req)
      redirect(req, res, data)
    } catch (error) {
      render(req, res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      })
    }
  },
  show: async (req, res) => {
    try {
      const data = await Service.show(req)
      render(req, res, data)
    } catch (error) {
      render(req, res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      })
    }
  },
  new: async (req, res) => {
    try {
      const data = await Service.new(req)

      render(req, res, data)
    } catch (error) {
      render(req, res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      })
    }
  },
  update: async (req, res) => {
    try {
      const data = await Service.update(req)
      redirect(req, res, data)
    } catch (error) {
      render(req, res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      })
    }
  },
  patch: async (req, res) => {
    try {
      const data = await Service.patch(req)
      redirect(req, res, data)
    } catch (error) {
      render(req, res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      })
    }
  },
  delete: async (req, res) => {
    try {
      const data = await Service.delete(req)
      redirect(req, res, data)
    } catch (error) {
      render(req, res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      })
    }
  }
}
