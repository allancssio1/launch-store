const express = require('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer')

const ProductsController = require('./app/controllers/ProductsController')
const HomeController = require('./app/controllers/HomeController')
const SearchController = require('./app/controllers/SearchController')

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

// login/logout

routes.get('/login', SessionController.loginForm)
routes.post('/login', SessionController.login)
routes.post('/logout', SessionController.logout)

// reset password / forgot
routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/forgot-password', SessionController.forgot)
routes.post('/password-reset', SessionController.reset)

// user register UserController
routes.get('/register', UserController.registerForm)
routes.post('/register', UserController.post)

routes.get('/', UserController.show)
routes.put('/', UserController.update)
routes.delete('/', UserController.delete)





module.exports = routes