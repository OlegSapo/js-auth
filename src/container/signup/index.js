import {
  Form,
  REG_EXP_EMAIL,
  REG_EXP_PASSWORD,
} from '../../script/form' //підключаємо батьківський клас Form

// клас для роботи з формою реєстрації; посилання на батьківський клас Form (extends Form)
class SignupForm extends Form {
  FIELD_NAME = {
    //для зручності задаємо назви полей вводу
    EMAIL: 'email',
    PASSWORD: 'password',
    PASSWORD_AGAIN: 'passwordAgain',
    ROLE: 'role',
    IS_CONFIRM: 'isConfirm',
  }

  FIELD_ERROR = {
    //тексти для помилок під час валідації lаних
    IS_EMPTY: 'Введіть значення в поле',
    IS_BIG: 'Дуже довге значення, приберіть зайве',
    EMAIL: 'Введіть коректне значення e-mail адреси',
    PASSWORD:
      'Пароль повинен складатися неменше, ніж з 8 символів, включаючи хоча б одну цифру, малу і ВЕЛИКУ літеру',
    PASSWORD_AGAIN:
      'Ваш пароль не збігається з вище введеним',
    NOT_CONFIRM: 'Вам необхідно погодитись з правилами',
    ROLE: 'Ви не обрали роль',
  }

  //функція валідації (правільності вводу) значень введених в полі вводу
  validate = (name, value) => {
    //функція перевірки відповідності формату введених даних в полі вводу input
    if (String(value).length < 1) {
      return this.FIELD_ERROR.IS_EMPTY
    }

    if (String(value).length > 20) {
      return this.FIELD_ERROR.IS_BIG
    }

    //якщо ми працюємо з полем вводу name='email'
    if (name === this.FIELD_NAME.EMAIL) {
      //перевірка введеного значення в поле вводу (name='email') на відповідність регулярному виразу для пошти
      if (!REG_EXP_EMAIL.test(String(value))) {
        return this.FIELD_ERROR.EMAIL
      }
    }

    //якщо ми працюємо з полем вводу name='password'
    if (name === this.FIELD_NAME.PASSWORD) {
      if (!REG_EXP_PASSWORD.test(String(value))) {
        return this.FIELD_ERROR.PASSWORD
      }
    }

    if (name === this.FIELD_NAME.PASSWORD_AGAIN) {
      //для поля вводу name='passwordAgain' перевіряємо чи недорівнює воно значенню поля вводу password
      if (
        String(value) !==
        this.value[this.FIELD_NAME.PASSWORD]
      ) {
        return this.FIELD_ERROR.PASSWORD_AGAIN
      }
    }

    if (name === this.FIELD_NAME.IS_CONFIRM) {
      if (Boolean(value) !== true) {
        return this.FIELD_ERROR.NOT_CONFIRM
      }
    }

    //якщо ми працюємо з полем вводу name='role'
    if (name === this.FIELD_NAME.ROLE) {
      if (isNaN(value)) {
        return this.FIELD_ERROR.ROLE
      }
    }
  }

  //функція відправки даних
  submit = () => {
    this.checkDisabled() //перевірка активності кнопки за результатами валідації даних у полі вводу форми реєстрації

    console.log(this.value)
  }
}

//підключаемо клас SignupForm через змінну signupForm з урахуванням, що в нас наслідування (new SignupForm())
window.signupForm = new SignupForm()
