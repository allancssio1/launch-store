const express = require('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer')

const ProductsController = require('./app/controllers/ProductsController')
const HomeController = require('./app/controllers/HomeController')
const SearchController = require('./app/controllers/SearchController')

const users = require('./users')
const products = require('./products')

routes.use('/users', users)
routes.use('/products', users)

routes.get('/', HomeController.index)

routes.get('/products/search', SearchController.index)

routes.get('/products/create', ProductsController.create)
routes.get('/products/:id/edit', ProductsController.edit)
routes.get('/products/:id', ProductsController.show)

routes.post('/products', multer.array("photos", 6), ProductsController.post)
routes.put('/products', multer.array('photos', 6),ProductsController.put)
routes.delete('/products', ProductsController.delete)

routes.get('/ads/create', function (req, res) {
  return res.redirect("/products/create")
})







module.exports = routes