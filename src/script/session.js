//имена для сесій
export const SESSION_KEY = 'sessionAuth'

//функція для збереження сесії
export const saveSession = (session) => {
  try {
    // console.log(session)
    window.session = session

    //зберігаємо об'єкт нашої сесії в локальне сховище (localStorage) браузера під ключем SESSION_KEY у форматі JSON
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(session),
    )
  } catch (error) {
    console.log(error)
    window.session = null
  }
}

//функція завантаження сесії з localStorage в браузер
export const loadSession = () => {
  try {
    //отримуємо дані сесії з localStorage по ключу SESSION_KEY та конвертуємо їх назад з JSON
    const session = JSON.parse(
      localStorage.getItem(SESSION_KEY),
    )

    //якщо завантажена cecію існує, то записуємо її в window браузера
    if (session) {
      window.session = session
    } else {
      window.session = null
    }
  } catch (error) {
    console.log(error)
    window.session = null
  }
}

//функція для отримання токена з сесії
export const getTokenSession = () => {
  try {
    const session = getSession()

    return session ? session.token : null
  } catch (error) {
    console.log(error)
    return null
  }
}

//функція для отримання токена з сесії
export const getSession = () => {
  try {
    //отримуємо дані сесії з localStorage по ключу SESSION_KEY та конвертуємо їх назад з JSON або з window.session
    const session =
      JSON.parse(localStorage.getItem(SESSION_KEY)) ||
      window.session

    //повертаємо сесію користувача пбо null
    return session || null
  } catch (error) {
    console.log(error)
    return null
  }
}
