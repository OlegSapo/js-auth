// клас токенів підтвердження для входу на сайт (особистий кабінет, обліковку тощо)

class Session {
  static #list = [] //список токенів

  //конструктор для нових об'єктів класа
  constructor(user) {
    this.token = Session.generateCode() //генерування кодів
    this.user = {
      email: user.email, //пошта користувача
      isConfirm: user.isConfirm, //чи підтредив користувач пошту
      role: user.role,
      id: user.id,
    }
  }

  //метод для генерації токенів
  static generateCode = () => {
    //довжина токена в символах
    const length = 6

    //набір допустипих симовлів в токені
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvxyz0123456789'

    //формування токена
    let result = ''
    for (let i = 0; i < length; i++) {
      let randomIndex = Math.floor(
        Math.random() * characters.length,
      )
      result += characters[randomIndex]
    }

    return result
  }

  //метод, що створює об'єкт класу та зберігає в #list
  static create = (user) => {
    //створення нової сесії
    const session = new Session(user)

    this.#list.push(session) //вносимо в #list новий об'єкт

    return session
  }

  //метод для пошуку потрібного токена в базі токенів
  static get = (token) => {
    return this.#list.find(
      (item) => item.token === token || null,
    )
  }
}

module.exports = { Session } //експортуємо клас Confirm

console.log('token = ', Session.generateCode())
