//підключаємо батьківський клас Form
import {
  Form,
  REG_EXP_EMAIL,
  REG_EXP_PASSWORD,
} from '../../script/form'

//підключаємо функцію saveSession для запису сесію в localStorage
import { saveSession } from '../../script/session'

// клас для роботи з формою реєстрації; посилання на батьківський клас Form (extends Form)
class SignupForm extends Form {
  FIELD_NAME = {
    //для зручності задаємо назви полей вводу
    EMAIL: 'email',
    PASSWORD: 'password',
  }

  FIELD_ERROR = {
    //тексти для помилок під час валідації lаних
    IS_EMPTY: 'Введіть значення в поле',
    IS_BIG: 'Дуже довге значення, приберіть зайве',
    EMAIL: 'Введіть коректне значення e-mail адреси',
    // PASSWORD:  //прибрали, що не давати підказки зловмисникам
    //   'Пароль повинен складатися неменше, ніж з 8 символів, включаючи хоча б одну цифру, малу і ВЕЛИКУ літеру',
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

    //прибираємо валідацію, щоб не робити підказки зловмисникам, які вимоги до паролю
    // if (name === this.FIELD_NAME.PASSWORD) {
    //   if (!REG_EXP_PASSWORD.test(String(value))) {
    //     return this.FIELD_ERROR.PASSWORD
    //   }
    // }
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
        const res = await fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: this.convertData(),
        })

        const data = await res.json() // повертає те, що знаходитться в route

        if (res.ok) {
          this.setAlert('success', data.message)
          // alert(data.session.token)
          saveSession(data.session) //в разі вдалої реєстрації зберігаємо сесію та отримувати token користувача

          //після вдалої реєстрації користувача переходимо на головну сторінку
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
      [this.FIELD_NAME.EMAIL]:
        this.value[this.FIELD_NAME.EMAIL],
      [this.FIELD_NAME.PASSWORD]:
        this.value[this.FIELD_NAME.PASSWORD],
    })
  }
}

//підключаемо клас SignupForm через змінну signupForm з урахуванням, що в нас наслідування (new SignupForm())
window.signupForm = new SignupForm()

//вхід в акаунт якщо вже є збережена сесія (тобто вхід в акаунт вже виконано)
document.addEventListener('DOMContentLoaded', () => {
  if (window.session) {
    location.assign('/') //перехід на домашнюю сторінку
  }
})
