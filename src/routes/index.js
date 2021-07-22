const express = require('express')
const routes = express.Router()

const HomeController = require('../app/controllers/HomeController')

const products = require('./products')
const users = require('./users')

routes.get('/', HomeController.index)

routes.use('/users', users)
routes.use('/products', products)

routes.get('/ads/create', function (req, res) {
  return res.redirect("/products/create")
})







module.exports = routes