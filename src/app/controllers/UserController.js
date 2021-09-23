const User = require('../models/User')
const {formatCpfCnpj, formatCep} = require('../lib/utils')

module.exports = {
  registerForm (req, res) {
    return res.render("user/register")
  },
  async show(req, res) {
    const {userId: id} = req.session

    const user = await User.findOne({ where: {id} })
    console.log("aqui ==>", user)

    if(!user) return res.render("user/register", {
      error: 'Usuário não encontrado!'
    })
    console.log("aqui ==>!!", user)


    user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
    user.cep = formatCep(user.cep)
    return res.render('user/index', {user})
  }
  ,
  async post(req, res) {
    
    const userId = await User.create(req.body)

    req.session.userId = userId

    return res.redirect('/users')

  }
}