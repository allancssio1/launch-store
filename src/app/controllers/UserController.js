const User = require('../models/User')

module.exports = {
  registerForm (req, res) {
    return res.render("user/register")
  },
  post(req, res) {
    const keys = Object.keys(req.body)

    for (key of keys) {
      if (req.body[key] == "")
        return res.send('Please, fill all fields!')
    }

    const { email, cpf_cnpj } = req.body
    const user = await User.findOne({
      where: { email },
      or: { dpf_cnpj }
    })

  }
}