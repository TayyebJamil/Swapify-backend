'use strict'
const UserService = require('../../services/admin/user.service')
const httpCode = require('../../utils/httpCodes')
const { render, redirect } = require('../../utils/response')

module.exports = {
  list: async (req, res) => {
    try {
      const users = await UserService.list(req)
      render(req, res, users)
    } catch (error) {
      req.flash('error', req.t(error.message))
      render(req, res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      })
    }
  },
  show: async (req, res) => {
    try {
      const user = await UserService.show(req)

      render(req, res, user)
    } catch (error) {
      render(req, res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      })
    }
  },
  new: async (req, res) => {
    try {
      const user = await UserService.new(req)
      render(req, res, user)
    } catch (error) {
      render(req, res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      })
    }
  },
  create: async (req, res) => {
    try {
      const users = await UserService.create(req)
      redirect(req, res, users)
    } catch (error) {
      render(req, res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      })
    }
  },
  update: async (req, res) => {
    try {
      const users = await UserService.update(req)
      redirect(req, res, users)
    } catch (error) {
      render(req, res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      })
    }
  },
  patch: async (req, res) => {
    try {
      const users = await UserService.patch(req)
      redirect(req, res, users)
    } catch (error) {
      render(req, res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      })
    }
  },
  block: async (req, res) => {
    try {
      const users = await UserService.block(req)
      redirect(req, res, users)
    } catch (error) {
      render(req, res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      })
    }
  },
  delete: async (req, res) => {
    try {
      const users = await UserService.delete(req)
      redirect(req, res, users)
    } catch (error) {
      render(req, res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      })
    }
  },
  searchAgent: async (req, res) => {
    try {
      const users = await UserService.searchAgent(req)
      res.send(users)
    } catch (error) {
      render(req, res, {
        httpCode: httpCode.INTERNAL_SERVER_ERROR,
        path: 'pages-error-500'
      })
    }
  }
}
