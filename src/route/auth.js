// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

//підключаємо (імпортуємо) клас User
const { User } = require('../class/user')

//підключаємо (імпортуємо) клас Confirm
const { Confirm } = require('../class/confirm')

//підключаємо (імпортуємо) клас Session
const { Session } = require('../class/session')

//створюємо тестового користувача
User.create({
  email: 'test@gmail.com',
  password: 12345,
  role: 1,
})

User.create({
  email: 'proba@linkedin.com',
  password: 12345,
  role: 2,
})

User.create({
  email: 'roberto@soli.it',
  password: 12345,
  role: 3,
})

// ====================

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

//роутер-ПОСТ для відправки даних на сервер; Ендпоінт реєстрації користувача
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

    // бізнес-логіка, щодо необхідності перевірки роботи важливих функцій ендпоінта, що можуть призвести до збоїв в роботы сервера
    //створюємо нового користувача
    const newUser = User.create({ email, password, role })

    //отримуємо сесію
    const session = Session.create(newUser)

    //створюємо для нового користувача код підтвердження для пошти
    Confirm.create(newUser.email)

    //статус "все добре"(200) від сервера
    return res.status(200).json({
      message: 'Користувач успішно зареєстрований', //відповідне повідомлення
      session, //передаємо на сервер сесію (разом з токен користувача всередині)
    })
  } catch (error) {
    //статус "помилка"(400) від сервера
    return res.status(400).json({
      message: "Помилка. Обов'язкові дані відсутні",
    })
  }
})

//====================

//роутер-ГЕТ для відображення сторінки на відновлення паролю
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

//==================

//роутер-ГЕТ для відображення сторінки підтвердження зміни паролю
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

    //створюємо нову сесію після відновлення паролю користувача
    const session = Session.create(user)

    //повертаємо повідомленн, що пароль змінено та повертає поточну сесію
    return res.status(200).json({
      message: 'Пароль успішно змінено',
      session,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

//==================

//роутер-ГЕТ для для відображення сторінки підтвердження пошти
router.get('/signup-confirm', function (req, res) {
  //отримання нового коду для підтвердження пошти користувача
  const { renew, email } = req.query

  //якщо є renew
  if (renew) {
    Confirm.create(email)
  }

  // res.render генерує нам HTML сторінку; вводимо назву файлу з сontainer
  res.render('signup-confirm', {
    // вказуємо назву контейнера
    name: 'signup-confirm',
    // вказуємо назви компонентів
    component: ['back-button', 'field'],
    title: 'Signup confirm page', // вказуємо назву сторінки

    // вказуємо дані,
    data: {},
  })
})

//роутер-ПОСТ для відправки даних на сервер; Ендпоінт-запит на підтвердження пошти
router.post('/signup-confirm', function (req, res) {
  //деструктурізація даних, що беремо з HTML-сторінки
  const { code, token } = req.body

  //перевіряємо "чи всі дані отримано"
  if (!code || !token) {
    return res.status(400).json({
      //виводимо повідомлення про помилку
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  //перевірка валідності введених даних та підтвердження пошти
  try {
    //отримуємо об'єкт сесію по токену
    const session = Session.get(token)

    //якщо чи існує сесія
    if (!session) {
      return res.status(400).json({
        message: 'Помилка. Ви не увійшли в аккаунт',
      })
    }

    //отримуємо пошту по коду підтвердження, що вводе користувач
    const email = Confirm.getData(code)

    //якщо пошти не існує, то і код підтвердження не існує
    if (!email) {
      return res.status(400).json({
        message: 'Помилка. Код не існує',
      })
    }

    if (email !== session.user.email) {
      return res.status(400).json({
        message: 'Код не дійсний',
      })
    }

    // //змінюємо дані користувача в оригінальному об'єкті
    // const user = User.getByEmail(session.user.email)

    // //змінюємо isConfirm в сесії
    // user.isConfirm = true
    session.user.isConfirm = true

    return res.status(200).json({
      message: 'Ви підтвердили свою пошту',
      session, //повертаємо оновлені дані користувача
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

//==================

//роутер-ГЕТ для для відображення сторінки входу в аккаунт (login)
router.get('/login', function (req, res) {
  // res.render генерує нам HTML сторінку; вводимо назву файлу з сontainer
  res.render('login', {
    // вказуємо назву контейнера
    name: 'login',
    // вказуємо назви компонентів
    component: ['back-button', 'field', 'field-password'],
    title: 'Login page', // вказуємо назву сторінки

    // вказуємо дані,
    data: {},
  })
})

//роутер-ПОСТ для відправки даних на сервер; Ендпоінт-запит на вхід в акаунт
router.post('/login', function (req, res) {
  const { email, password } = req.body

  //перевіряємо наявність пошти та пароля
  if (!email || !password) {
    return res.status(400).json({
      //виводимо повідомлення про помилку
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    //отримуюємо дані користувача по введеному email
    const user = User.getByEmail(email)

    //перевырка чи існує такий користувач
    if (!user) {
      return res.status(400).json({
        //виводимо повідомлення про помилку
        message:
          'Помилка. Користувача з таким email не існує',
      })
    }

    //перевіряємо пароль користувача
    if (user.password !== password) {
      return res.status(400).json({
        //виводимо повідомлення про помилку
        message: 'Помилка. Не вірний пароль',
      })
    }

    //створюємо сесію для користувача
    const session = Session.create(user)

    return res.status(200).json({
      //виводимо повідомлення про успішний вхід до системи
      message: 'Ви увійшли',
      session, //повертаємо користувачу його сесію
    })
  } catch (error) {
    return res.status(400).json({
      //виводимо повідомлення про помилку
      message: error.message,
    })
  }
})

//==================

module.exports = router // Підключаємо роутер до бек-енду
