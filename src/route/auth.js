// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

//підключаємо клас User
const { User } = require('../class/user')

//підключаємо клас Confirm
const { Confirm } = require('../class/confirm')

//створюємо тестового користувача
User.create({
  email: 'test@gmail.com',
  password: 12345,
  role: 1,
})

// ================================================================

// роутер-ГЕТ використовується  для відображення сторінки реєстрації
router.get('/signup', function (req, res) {
  // res.render генерує нам HTML сторінку; вводимо назву файлу з сontainer
  res.render('signup', {
    // вказуємо назву контейнера
    name: 'signup',
    // вказуємо назви компонентів
    component: [
      'back-button',
      'field',
      'field-password',
      'field-select',
      'field-checkbox',
    ],
    title: 'Signup page', // вказуємо назву сторінки

    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {
      //список ролей (випадаючий список під час реєстрації)
      role: [
        { value: User.USER_ROLE.USER, text: 'Користувач' },
        {
          value: User.USER_ROLE.ADMIN,
          text: 'Адміністратор',
        },
        {
          value: User.USER_ROLE.DEVELOPER,
          text: 'Розробник',
        },
      ],
    },
  })
})

//роутер-ПОСТ для відправки даних на сервер; Ендпохнт реєстрації користувача
router.post('/signup', function (req, res) {
  //деструктарізація даних з форми сторінки реєстрація (req.body)
  const { email, password, role } = req.body
  console.log(req.body)

  //переврка, щоб всі необхідні поля були введені
  if (!email || !password || !role) {
    return res.status(400).json({
      //статус "помилки"(400) від сервера
      message: "Помилка. Обов'язкові дані відсутні",
    })
  }

  try {
    //отримуємо дані користувча по email
    const user = User.getByEmail(email)

    //перевірка "чи вже існує користувач з таким email"
    if (user) {
      return res.status(400).json({
        message:
          'Помилка. Користувач з таким email вже існує',
      })
    }

    User.create({ email, password, role }) // бізнес-логіка, щодо необхідності перевірки роботи важливих функцій ендпоінта, що можуть призвести до збоїв роботи сервера

    //статус "все добре"(200) від сервера
    return res.status(200).json({
      message: 'Користувач успішно зареєстрований',
    })
  } catch (error) {
    //статус "помилка"(400) від сервера
    return res.status(400).json({
      message: "Помилка. Обов'язкові дані відсутні",
    })
  }
})

//====================
//роутер-ГЕТ для відображення сторінки запиту на відновлення паролю
router.get('/recovery', function (req, res) {
  // res.render генерує нам HTML сторінку; вводимо назву файлу з сontainer
  res.render('recovery', {
    // вказуємо назву контейнера
    name: 'recovery',
    // вказуємо назви компонентів
    component: ['back-button', 'field'],
    title: 'Recovery page', // вказуємо назву сторінки

    // вказуємо дані,
    data: {},
  })
})

//роутер-ПОСТ для відправки даних на сервер; Ендпоінт-запит на відновлення паролю
router.post('/recovery', function (req, res) {
  //витягуємо з body (HTML-сторінка) пошту, що ввів коритсувач
  const { email } = req.body

  console.log(email)

  //перевірка "чи було введено email"
  if (!email) {
    return res.status(400).json({
      message:
        "Помилка. Обов'язкові поля вволу не заповнені",
    })
  }

  //робимо пошук user по email
  //обгортаємо в try-catch щоб уникнути помилки та виключити падіння сервера
  try {
    //отримання облікового запису користувача за введеним email
    const user = User.getByEmail(email)

    //перевіряємо чи існує такий користувач (user) інакше видаємо інфо про помилку
    if (!user) {
      return res.status(400).json({
        message: 'Користувача з таким email не існує',
      })
    }

    Confirm.create(email)

    return res.status(200).json({
      message: 'Код для відновлення паролю відправлено',
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

///==================
//роутер-ГЕТ для відображення сторінки відновлення паролю
router.get('/recovery-confirm', function (req, res) {
  // res.render генерує нам HTML сторінку; вводимо назву файлу з сontainer
  res.render('recovery-confirm', {
    // вказуємо назву контейнера
    name: 'recovery-confirm',
    // вказуємо назви компонентів
    component: ['back-button', 'field', 'field-password'],
    title: 'Recovery confirm page', // вказуємо назву сторінки

    // вказуємо дані,
    data: {},
  })
})

//роутер-ПОСТ для відправки даних на сервер; Ендпоінт-запит на заміну паролю
router.post('/recovery-confirm', function (req, res) {
  //деструктурізація даних, що беремо з HTML-сторінки
  const { password, code } = req.body

  console.log(password, code)

  //перевіряємо "чи всі дані отримано"
  if (!code || !password) {
    return res.status(400).json({
      //виводимо повідомлення про помилку
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  //перевірка валідності введених даних та відновлення паролю
  try {
    //отримуємо по code пошту користувача
    const email = Confirm.getData(Number(code))

    //якщо такої пошти в базі сервера не виявлено
    if (!email) {
      return res.status(400).json({
        message: 'Вказаний код не існує',
      })
    }

    //пошук користувача по email
    const user = User.getByEmail(email)

    //якщо такого користувача не виявлено в базі сервера
    if (!user) {
      return res.status(400).json({
        message: 'Користувача з таким email не існує',
      })
    }

    //змінюємо пароль користувача на новий
    user.password = password

    console.log(user)

    //повертаємо повідомленн, що пароль змінено
    return res.status(200).json({
      message: 'Пароль успішно змінено',
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

module.exports = router // Підключаємо роутер до бек-енду
