// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

//підключаємо (імпортуємо) клас User
const { User } = require('../class/user')

// ====================

// роутер-ГЕТ буде відображати контейнер для списка зареєстрованих користувачів
router.get('/user-list', function (req, res) {
  // res.render генерує нам HTML сторінку; вводимо назву файлу з сontainer
  res.render('user-list', {
    // вказуємо назву контейнера
    name: 'user-list',
    // вказуємо назви компонентів
    component: ['back-button'],
    title: 'User list page', // вказуємо назву сторінки

    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
})

//роутер-ГЕТ буде повертати дані користувачів, які будимо завантажувати в контейнер user-list
router.get('/user-list-data', function (req, res) {
  //отримання списка користувачів
  const list = User.getList()

  console.log(list)

  //якщо список порожній
  if (list.length === 0) {
    //код 400 - помилка
    return res.status(400).json({
      //виводимо повідомлення про помилку
      message: 'Список користувачів порожній',
    })
  }

  //якщо в списку є користувачі, то формуємо список
  return res.status(200).json({
    //повертаємо об'єкт list в якому масив об'єктів з інформацією по кожному користувачу; функція map для масива - створює новий масив для кожного елемента якого виконано callback-функція
    list: list.map(({ id, email, role }) => ({
      id,
      email,
      role,
    })),
  })
})

//==================

//роутер-ГЕТ буде відображати контейнер для виводу даних обраного користувача
router.get('/user-item', function (req, res) {
  // res.render генерує нам HTML сторінку; вводимо назву файлу з сontainer
  res.render('user-item', {
    // вказуємо назву контейнера
    name: 'user-item',
    // вказуємо назви компонентів
    component: ['back-button'],
    title: 'User item page', // вказуємо назву сторінки

    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
})

//роутер-ГЕТ буде повертати дані користувача, які будимо завантажувати в контейнер user-item
router.get('/user-item-data', function (req, res) {
  //отримуємо дані з query
  const { id } = req.query //??? чому пишимо у фігурних дужках

  //перевірка на існування id
  if (!id) {
    return res.status(400).json({
      message: 'Потрібно передати ID користувача',
    })
  }

  //отримуємо потрібного користувача по його id
  const user = User.getById(Number(id))

  //перевірка на існування юзера
  if (!user) {
    return res.status(400).json({
      message: 'Користувача з таким ID не існує',
    })
  }

  //якщо все добре, то повертаємо дані користувача
  return res.status(200).json({
    user: {
      //з даних користувача беремо лише потрібні нам
      id: user.id,
      email: user.email,
      role: user.role,
      isConfirm: user.isConfirm,
    },
  })
})

//================

module.exports = router // Підключаємо роутер до бек-енду
