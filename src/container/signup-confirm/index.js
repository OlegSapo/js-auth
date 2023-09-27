import { Form } from '../../script/form' //підключаємо батьківський клас Form

import {
  saveSession, //підключаємо saveSession
  getTokenSession, //підключаємо getTokenSession
  getSession, //підключаємо getSession
} from '../../script/session'

// клас для роботи з формою підтвердження пошти; посилання на батьківський клас Form (extends Form)
class SignupConfirmForm extends Form {
  FIELD_NAME = {
    //для зручності задаємо назви полей вводу
    CODE: 'code',
  }

  FIELD_ERROR = {
    //тексти для помилок під час валідації lаних
    IS_EMPTY: 'Введіть значення в поле',
    IS_BIG: 'Дуже довге значення, приберіть зайве',
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
        const res = await fetch('/signup-confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: this.convertData(),
        })

        const data = await res.json() // повертає те, що знаходитться в route

        if (res.ok) {
          this.setAlert('success', data.message)

          //після вдалого відновлення паролю, генеруємо новий токен(сесію)
          saveSession(data.session)

          //після вдалого відновлення паролю користувача переходимо на головну сторінку
          location.assign('/')
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
      token: getTokenSession(), //відправка токена
    })
  }
}

//підключаемо клас SignupForm через змінну signupForm з урахуванням, що в нас наслідування (new SignupForm())
window.signupConfirmForm = new SignupConfirmForm()

//вхід в акаунт якщо вже є збережена сесія (тобто вхід в акаунт вже виконано)
document.addEventListener('DOMContentLoaded', () => {
  try {
    //якщо є сесія
    if (window.session) {
      //перевіряємо isConfirm на true
      if (window.session.user.isConfirm) {
        location.assign('/') //перехід на головну сторінку
      }
    } else {
      //якщо не має сесії
      location.assign('/') //перехід на головну сторінку
    }
  } catch (error) {}

  document
    .querySelector('#renew')
    .addEventListener('click', (event) => {
      //відміняємо дії браузера за-замовчуванням в разі події 'click
      event.preventDefault()

      //отримуємо сесію користувача
      const session = getSession()

      //перехід на потрібну підтвердження пошти та присвоєння renew значення true та оримання значення email користувача
      location.assign(
        `/signup-confirm?renew=true&email=${session.user.email}`,
      )
    })
})
