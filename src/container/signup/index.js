class SignupForm {
  static value = {} //обєкт куди записуються значення полів вводу; ключ обєкта це name='' в input

  static validate = (name, value) => {
    //функція перевірки відповідності формату введених даних в полі вводу input
    return true
  }

  static submit = () => {
    //функція відправки даних
    console.log(this.value)
  }

  static change = (name, value) => {
    //функція збереження змін введених в полі вводу
    console.log(name, value)
    if (this.validate(name, value)) {
      this.value[value] = value
    }
  }
}

window.signupForm = SignupForm //підключаемо клас SignupForm через змінну signupForm
