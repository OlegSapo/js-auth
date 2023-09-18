//створюємо регулярний вираз для перевірки правильності синтаксису введення пошти (email)
export const REG_EXP_EMAIL = new RegExp(
  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/,
)

//створюємо регулярний вираз для перевірки правильності синтаксису введення паролю (password)
export const REG_EXP_PASSWORD = new RegExp(
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
)

// батьківський клас для форми реєстрації (для класу SignupForm)
export class Form {
  //не можна робити static поля та методи, оскільки вони не будуть наслідуватися
  FIELD_NAME = {} //для зручності задаємо назви полей вводу
  FIELD_ERROR = {} //тексти для помилок під час валідації lаних

  value = {} //обєкт куди записуються значення полів вводу; ключ обєкта це name='' в input
  error = {} //помилки, що виникають в полях вводу
  disabled = false //признак активна/неактивна кнопка "зареєструватися"

  //функція збереження змін введених в полі вводу
  change = (name, value) => {
    // console.log(name, value)

    //запис введених значень в полях вводу
    this.value[name] = value

    //в разі наявності помилки при вводі значень в полі вводу
    this.checkValid(name, value)
  }

  //функція появу в HTML-версці повідомлення про помилку вводу
  setError = (name, error) => {
    const span = document.querySelector(
      `.form__error[name="${name}"]`,
    )

    const field = document.querySelector(
      `.validation[name="${name}"]`,
    )

    if (span) {
      span.classList.toggle(
        'form__error--active',
        Boolean(error),
      )
      span.innerText = error || ''
    }

    if (field) {
      field.classList.toggle(
        'validation--active',
        Boolean(error),
      )
    }
  }

  //функція, що робить кнопку "зареєструватися" активною чи ні, тобто чи всі поля форми реєстрації правильно заповнені та готові до відправки
  checkValid = (name, value) => {
    let disabled = false //disabled відключено, тобто кнопка вимнена

    //проходимо про кожному FIELD_NAME
    Object.values(this.FIELD_NAME).forEach((name) => {
      const error = this.validate(name, this.value(name)) //валідуємо кожне поле вводу

      if (error) {
        this.setError(name, error) //відтворюємо помилку
        disabled = true //якщо є помилка, то робимо кнопку "зареєструватися" неактивною
        this.error[name] = error //додаємо в класі тега значеня error
      } else {
        this.setError(name, null) //вимикаємо в класі тега значеня error
        delete this.error[name] //прибираємо в HTML-версці появу повідомлення помилки
      }
    })

    const el = document.querySelector(`.button`) //елемент з класом "button"

    if (el) {
      //вмикаємо/вимикаємо у кнопки клас "button--disabled"
      el.classList.toggle(
        'button--disabled',
        Boolean(disabled),
      )
    }

    this.disabled = disabled
  }
}
