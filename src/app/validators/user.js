const User = require("../models/User")
const { compare } = require('bcryptjs')

function checkAllFields(body) {
  const keys = Object.keys(body.body)

  for (key of keys) {
    if (body.body[key] === "")
      return {
        user: body.body,
        error: 'Preencha todos os dados.'
      }
  }
  return body
}

async function show (req, res, next) {
  const {userId: id} = req.session

  const user = await User.findOne({ where: {id} })

  if(!user) return res.render("user/register", {
    error: 'Usuário não encontrado!'
  }) 
  
  req.user = user

  next()
}

async function post(req, res, next) {
  
  const fillAllFields = checkAllFields(req.body)

  if(fillAllFields) {
    return res.render('user/register', fillAllFields)
  }

  let { email, cpf_cnpj, password, passwordRepeat } = req.body

  cpf_cnpj = cpf_cnpj.replace(/\D/g, '')
  
  const user = await User.findOne({
    WHERE: { email },
    OR: { cpf_cnpj }
  })

  if(user) return res.render("user/register", {
    user: req.body,
    error: 'Usuário já existe.'
  })

  if (password !== passwordRepeat) {
    return res.render("user/register", {
      user: req.body,
      error: 'Senha não são indênticas.'
    })
  }

  next()
}
async function update(req, res, next) {
  // verificação se campos preenchidos
  const fillAllFields = checkAllFields(req.body)
  if(fillAllFields) {
    return res.render('user/register', fillAllFields)
  }

  const { id, password } = req.body

  //campo de senha vazio
  if (!password) return req.render('user/index', {
    user: req.body,
    error: 'Coloque sua senha para atualizar seu cadastro'
  })

  const user = await User.findOne({where: {id}})
  // compare é uma função do bcryptjs
  const passed = await compare(password, user.password)

  //se senhas criptografadas forem diferentes.
  if (!passed) return res.render('user/index', {
    user: req.body,
    error: 'Senha incorreta.'
  })

  req.user = user

  next()
}

module.exports = {
  post,
  show,
  update
}