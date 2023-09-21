import {
  Form,
  REG_EXP_EMAIL,
  REG_EXP_PASSWORD,
} from '../../script/form' //підключаємо батьківський клас Form

// клас для роботи з формою реєстрації; посилання на батьківський клас Form (extends Form)
class RecoveryConfirmForm extends Form {
  FIELD_NAME = {
    //для зручності задаємо назви полей вводу
    CODE: 'code',
    PASSWORD: 'password',
    PASSWORD_AGAIN: 'passwordAgain',
  }

  FIELD_ERROR = {
    //тексти для помилок під час валідації lаних
    IS_EMPTY: 'Введіть значення в поле',
    IS_BIG: 'Дуже довге значення, приберіть зайве',
    PASSWORD:
      'Пароль повинен складатися неменше, ніж з 8 символів, включаючи хоча б одну цифру, малу і ВЕЛИКУ літеру',
    PASSWORD_AGAIN:
      'Ваш пароль не збігається з вище введеним',
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
  }

  //функція відправки даних; асинхронна функція, так як далі функція fetch()
  submit = async () => {
    //перевірка активності кнопки за результатами валідації даних у полі вводу форми реєстрації
    if (this.disabled === true) {
      this.validateAll()
    } else {
      console.log(this.value)

      //поки дані відпраляються робимо відповідне повідомлення
      this.setAlert('progress', 'Завантаження...')

      //якщо аиникла помилка під час відправки даних на сервер
      try {
        //асинхронна функція; res (response) - відповідь
        const res = await fetch('/recovery-confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: this.convertData(),
        })

        const data = await res.json() // повертає те, що знаходитться в route

        if (res.ok) {
          this.setAlert('success', data.message)
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
      [this.FIELD_NAME.CODE]: Number(
        this.value[this.FIELD_NAME.CODE],
      ),
      [this.FIELD_NAME.PASSWORD]:
        this.value[this.FIELD_NAME.PASSWORD],
      // [this.FIELD_NAME.PASSWORD_AGAIN]:
      //   this.value[this.FIELD_NAME.PASSWORD_AGAIN],
    })
  }
}

//підключаемо клас SignupForm через змінну signupForm з урахуванням, що в нас наслідування (new SignupForm())
window.recoveryConfirmForm = new RecoveryConfirmForm()
