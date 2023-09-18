// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

//підключаємо клас User
const { User } = require('../class/user')

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
    User.create({ email, password, role }) // бізнес-логіка, щодо необхідності перевірки роботи важливих функцій ендпоінта, що можуть призвести до збоїв роботи сервера

    return res.status(200).json({
      //статус "все добре"(200) від сервера
      message: 'Користувач успішно зареєстрований',
    })
  } catch (error) {
    return res.status(400).json({
      //стату "помилки"(400) від сервера
      message: "Помилка. Обов'язкові дані відсутні",
    })
  }
})

module.exports = router // Підключаємо роутер до бек-енду
