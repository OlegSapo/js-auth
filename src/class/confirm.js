// клас кодів підтвердження для зміни паролю облікового запису

class Confirm {
  static #list = [] //список кодів

  //конструктор для нових об'єктів класа
  constructor(data) {
    this.code = Confirm.generateCode() //генерування кодів
    this.data = data
  }

  //метод для генерації 4-хзначних кодів
  static generateCode = () => {
    return Math.floor(Math.random() * 9000) + 1000
  }

  //метод, що створює об'єкт класу та зберігає в #list
  static create = (data) => {
    this.#list.push(new Confirm(data)) //вносимо в #list новий об'єкт

    //видалення коду через 24 години
    setTimeout(() => {
      this.delete(code)
    }, 24 * 60 * 60 * 1000) //24 години у мілісекундах

    console.log(this.#list) //зазвичай замість console.log код відправляється на sms або email
  }

  //метод, що видаляє сгенеретований код через 24 години
  static delete = (code) => {
    //логіка перевірки "чи видалився код"
    const length = this.#list

    this.#list = this.#list.filter(
      (item) => item.code !== code,
    )

    return length > this.#list.length
  }

  //метод для отримання даних по коду
  static getData = (code) => {
    const obj = this.#list.find(
      (item) => item.code === code,
    )

    return obj ? obj.data : null
  }
}

module.exports = { Confirm } //експортуємо клас Confirm
