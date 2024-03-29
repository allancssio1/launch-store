const db = require("../../config/db")
const { hash } = require('bcryptjs')
const { update } = require("../controllers/UserController")


module.exports = {
  async findOne(filters) {
    let query = `SELECT * FROM users` //inicio da estrura de select

    // para cada uma das posições do filter crie uma chave
    Object.keys(filters).map (async key => {
      query = `${query} ${key}` // completa o select com a chave key === where

      // dentro cada filter na posição da key faça um map
      Object.keys(filters[key]).map(field => {
        query = `${query} ${field} = '${filters[key][field]}'` 

        /* pega a query ja montada e acrescenta o dado enviado
        * dentro do filters na posilão dessa key pegando o dado field
        * e coloque dentro dessa nova query
        */
      })
    })

      const results = await db.query(query)
      return results.rows[0]
  },
  async create(data) {
    try {
      const query = `
        INSERT INTO users (
          name,
          email,
          password,
          cpf_cnpj,
          cep,
          address
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `
      
      // hash para p password
      const passwordHash = await hash(data.password, 8)

      const values = [
        data.name,
        data.email,
        passwordHash,
        data.cpf_cnpj.replace(/\D/g, ''),
        data.cep.replace(/\D/g, ''),
        data.address
      ]

      const results = await db.query(query, values)

      return results.rows[0].id
    } catch (error) {
      console.error("Models/User create()", error)
    }
  },
  async update(id, fields) {
    let query = 'UPDATE users SET'

    Object.keys(fields).map((key, index, array) => {
      /*index e array é para saber se é a ultima posição do array,
        para nao a virgula no final de maneira dinâmica. */
      if((index+1) < array.length) {
        query = `${query}
          ${key} = '${fields[key]}',
        `
      } else {
        // ultima interação sem a virgula
        query = `${query}
        ${key} = '${fields[key]}'
        WHERE  id = ${id}
      `
      }

    })

    await db.query(query)

    return 
  }
}