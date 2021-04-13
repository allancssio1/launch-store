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
  }
}