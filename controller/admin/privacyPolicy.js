'use strict'
const PrivacyPolicyService = require('../../services/admin/privacyPolicy.js')
const httpCode = require('../../utils/httpCodes.js')
const { redirect, render } = require('../../utils/response.js')

module.exports = {
  list: async (req, res) => {
    try {
      const term = await PrivacyPolicyService.list()
      render(req, res, {
        httpCode: httpCode.OK,
        path: 'PrivacyPolicy/list',
        resources: term
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
      const term = await PrivacyPolicyService.create(req)
      redirect(req, res, term)
    } catch (error) {
      render(req, res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      })
    }
  },
  show: async (req, res) => {
    try {
      const term = await PrivacyPolicyService.show(req)
      render(req, res, term)
    } catch (error) {
      render(req, res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      })
    }
  },
  new: async (req, res) => {
    try {
      const term = await PrivacyPolicyService.new(req)

      render(req, res, term)
    } catch (error) {
      render(req, res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      })
    }
  },
  update: async (req, res) => {
    try {
      const term = await PrivacyPolicyService.update(req)
      redirect(req, res, term)
    } catch (error) {
      render(req, res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      })
    }
  },
  patch: async (req, res) => {
    try {
      const event = await PrivacyPolicyService.patch(req)
      redirect(req, res, event)
    } catch (error) {
      render(req, res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      })
    }
  },
  delete: async (req, res) => {
    try {
      const event = await PrivacyPolicyService.delete(req)
      redirect(req, res, event)
    } catch (error) {
      render(req, res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      })
    }
  }
}
