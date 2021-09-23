module.exports = {
  date: timestemp => {
    const date = new Date(timestemp),
     year = date.getFullYear(),
     month = `0${date.getMonth() + 1}`.slice(-2),
     day = `0${date.getDate()}`.slice(-2),
     hour = date.getHours(),
     minutes = date.getMinutes()
     
    return {
      day,
      month,
      year,
      hour,
      minutes,
      iso: `${year}-${month}-${day}`
    }
  },
  formatPrice(price){
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price/100)
  },
  formatCep(value) {
    value = value.replace(/\D/g, "")
    
    if (value.length > 8)
      value = value.slice(0, -1)

    value = value.replace(/(\d{5})(\d)/, "$1-$2")

    return value
  },
  formatCpfCnpj(value) {
    value = value.replace(/\D/g, "")

    if(value.length > 14) {
      value = value.slice(0, -1)
    }

    /* chef if cnpj => 99.999.999/0001-99
    * else is cpf => 999.999.999-99
    * (\d{repete x vezes}), "valor"
    */
    if(value.length > 11) {

      value = value.replace(/(\d{2})(\d)/, "$1.$2")
      value = value.replace(/(\d{3})(\d)/, "$1.$2")
      value = value.replace(/(\d{3})(\d)/, "$1/$2")
      value = value.replace(/(\d{4})(\d)/, "$1-$2")

    } else {

      value = value.replace(/(\d{3})(\d)/, "$1.$2")
      value = value.replace(/(\d{3})(\d)/, "$1.$2")
      value = value.replace(/(\d{3})(\d)/, "$1-$2")

    }

    return value
  }
}