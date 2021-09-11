const db = require("../../config/db")

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
  }
}