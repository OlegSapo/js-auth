class User {
  static USER_ROLE = {
    //константа ролей користувачів
    USER: 1, // назва ролі: ідентифікатор ролі
    ADMIN: 2,
    DEVELOPER: 3,
  }

  static #list = [] //список коритсувачів

  static #count = 1 //лічильник зареєстрованих користувачів

  //конструктор  для створення коритсувача
  constructor({ email, password, role }) {
    this.id = User.#count++ //ідентифікатор
    this.email = String(email).toLowerCase() //перетворюємо email на малі літери
    this.password = String(password) //перетворюємо пароль у рядок, оскільки пароль буде літерно-числовим
    this.role = User.#convertRole(role) //роль конвертуємо в значення(число)
    this.isConfirm = false //чи підтредив користувач пошту
  }

  static #convertRole = (role) => {
    //функція для перевірки ролі користувача
    role = Number(role) //робимо з ролі число

    if (isNaN(role)) {
      //якщо ролі не визначено, то за-замовчуванням роль буде user
      role = this.USER_ROLE.USER
    }

    role = Object.values(this.USER_ROLE).includes(role)
      ? role // прсвоюємо ролі її значення
      : this.USER_ROLE.USER //інакше ролі присвоюємо user

    return role
  }

  static create(data) {
    //метод класа User для створення нового користувача
    const user = new User(data)
    console.log(user)

    this.#list.push(user) //та додаємо його в масив #list
    console.log(this.#list)

    return user
  }

  static getByEmail(email) {
    // метод, що повертає коритсувача по його email або null, якщо такого email немає
    return (
      this.#list.find(
        (user) =>
          user.email === String(email).toLowerCase(), //перетворюємо пошту на String() та малі літери ( toLowerCase() )
      ) || null
    )
  }
}

module.exports = { User } //експортуємо клас User
