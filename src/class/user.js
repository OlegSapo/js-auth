class User {
  static USER_ROLE = {
    //константа ролей користувачів
    USER: 1, // назва ролі: ідентифікатор ролі
    ADMIN: 2,
    DEVELOPER: 3,
  }

  static #list = [] //список коритсувачів

  constructor({ email, password, role }) {
    //конструктор  для створення коритсувача
    this.email = email
    this.password = password
    this.role = User.#convertRole(role) //роль конвертуємо в значення(число)
  }

  static #convertRole = (role) => {
    //функція для перевірки ролі користувача
    role = Number(role) //робимо з ролі число

    if (isNaN(role)) {
      role = this.USER_ROLE.USER //якщо роли не визначено, то за-замовчуванням роль буде "юзер"
    }

    role = Object.values(this.USER_ROLE).includes(role)
      ? role // прсвоюємо ролі її значення
      : this.USER_ROLE.USER //інакше ролі присвоюємо "юзер"

    return role
  }

  static create(data) {
    //метод класа User для створення нового користувача
    const user = new User(data)
    this.#list.push(user) //та додаємо його в масив #list
  }
}

module.exports = { User } //експортуємо classs User
