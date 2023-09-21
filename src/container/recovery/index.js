import {
  Form,
  REG_EXP_EMAIL,
  REG_EXP_PASSWORD,
} from '../../script/form' //підключаємо батьківський клас Form

// клас для роботи з формою відновлення паролю; посилання на батьківський клас Form (extends Form)
class RecoveryForm extends Form {
  //для зручності задаємо назви полей вводу
  FIELD_NAME = {
    EMAIL: 'email',
  }

  //тексти для помилок під час валідації lаних
  FIELD_ERROR = {
    IS_EMPTY: 'Введіть значення в поле',
    IS_BIG: 'Дуже довге значення, приберіть зайве',
    EMAIL: 'Введіть коректне значення e-mail адреси',
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
  }

  //функція відправки даних; асинхронна функція, так як далі функція fetch()
  submit = async () => {
    //перевірка активності кнопки за результатами валідації даних у полі вводу форми реєстрації
    if (this.disabled === true) {
      this.validateAll()
    } else {
      //поки дані відпраляються робимо відповідне повідомлення
      this.setAlert('progress', 'Завантаження...')

      //якщо аиникла помилка під час відправки даних на сервер
      try {
        //асинхронна функція; res (response) - відповідь
        const res = await fetch('/recovery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: this.convertData(),
        })

        const data = await res.json() // повертає те, що знаходитться в route

        if (res.ok) {
          this.setAlert('success', data.message)

          //переходимо на сторінку задання новогоо паролю
          location.assign('/recovery-confirm')
        } else {
          this.setAlert('error', data.message)
        }
      } catch (error) {
        this.setAlert('error', error.message)
      }
    }
  }

  //функія конвертації даних в JSON для відправки на сервер
  convertData = () => {
    return JSON.stringify({
      [this.FIELD_NAME.EMAIL]:
        this.value[this.FIELD_NAME.EMAIL],
    })
  }
}

//підключаемо клас SignupForm через змінну signupForm з урахуванням, що в нас наслідування (new SignupForm())
window.recoveryForm = new RecoveryForm()
