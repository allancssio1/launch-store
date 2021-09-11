const User = require("../models/User")

async function post(req, res, next) {
  const keys = Object.keys(req.body)

    for (key of keys) {
      if (req.body[key] == "")
        return res.send('Please, fill all fields!')
    }

    let { email, cpf_cnpj, password, passwordRepeat } = req.body

    cpf_cnpj = cpf_cnpj.replace(/\D/g, '')
    
    const user = await User.findOne({
      WHERE: { email },
      OR: { cpf_cnpj }
    })

    // console.log(user)
    

    if(user) return res.send("usuário já existe")

    if (password != passwordRepeat) return res.send("senhas não são idênticas")

    next()
}

module.exports = {
  post
}