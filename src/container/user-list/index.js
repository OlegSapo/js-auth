//підключаємо клас List
import { List } from '../../script/list'
//підключваємо константи ролей юзера
import { USER_ROLE } from '../../script/user'

//створюємо клас списка користувачів (UserList) що буде наслідувати клас List
class UserList extends List {
  constructor() {
    super() //визиваємо щоб працював конструктор у батьківського класу List

    //додаємо в елемент(elemet)-відображення ідентифіктор 'id='user-list' '
    this.element = document.querySelector('#user-list')

    //якщо немає елемента(element) то видаєм помилку
    if (!this.element) throw new Error('Element is null')

    //починаємо завантаження даних
    this.loadData()
  }

  //завантаження даних
  loadData = async () => {
    //робимо оновлення статусу на LOADING
    this.updateStatus(this.STATE.LOADING)

    // return null

    try {
      //робимо ГЕТ-запит на певну сторінку
      const res = await fetch('/user-list-data', {
        method: 'GET',
      })

      //отримуємо дані
      const data = await res.json()

      if (res.ok) {
        //якщо отримали дані то робимо оновлення статусу на SUCCESS
        this.updateStatus(
          this.STATE.SUCCESS,
          //конвертуємо дані з JSON
          this.convertData(data),
        )
      } else {
        //якщо дані не отримали, то змінюємо статус на ERROR
        this.updateStatus(this.STATE.ERROR, data)
      }
    } catch (error) {
      console.log(error)
      //змінюємо статус на ERROR та маємо повідомлення про помилку під час роботи блоку коду try {...}
      this.updateStatus(this.STATE.ERROR, {
        message: error.message,
      })
    }
  }

  //функція конвертування даних з сервера (з JSON в зручний формат для виводу на сторінці)
  convertData = (data) => {
    return {
      //повертаємо всі дані
      ...data,
      //однак ми хочемо оновити певні дані всередині list
      //для чого проходимо по всім елементам списку .map() та застосовуємо для них потрібну нам callback-функцію
      list: data.list.map((user) => ({
        //передаємо всі дані юзера
        ...user,
        //змінюємо роль юзера
        role: USER_ROLE[user.role],
      })),
    }
  }

  //оновлення відображення даних на сторінці
  updateView = () => {
    //очищаємо зміст елементів сторінки перед виводом даних
    this.element.innerHTML = ''

    console.log(this.status, this.data)

    switch (this.status) {
      case this.STATE.LOADING:
        //код, що оновлює верстку елемента сторінки
        this.element.innerHTML = `
          <div class="user">
            <span class="user__title skeleton"></span>
            <span class="user__sub skeleton"></span>
          </div>

          <div class="user">
            <span class="user__title skeleton"></span>
            <span class="user__sub skeleton"></span>
          </div>

          <div class="user">
            <span class="user__title skeleton"></span>
            <span class="user__sub skeleton"></span>
          </div>

          <div class="user">
            <span class="user__title skeleton"></span>
            <span class="user__sub skeleton"></span>
          </div>
        `
        break

      case this.STATE.SUCCESS:
        //проходимо по list та додаємо у верстку інформацію про кожного юзера
        this.data.list.forEach((user) => {
          //додаємо блок за блоком інформацію про юзерів
          this.element.innerHTML += ` 
            <a href="/user-item?id=${user.id}" class="user user--click">
              <span class="user__title">${user.email}</span>
              <span class="user__sub">${user.role}</span>
            </a>
          `
        })
        break

      case this.STATE.ERROR:
        this.element.innerHTML = `
          <span class="alert alert--error">${this.data.message}</span>
        `
        break
    }
  }
}

//опрацювання сесії
document.addEventListener('DOMContentLoaded', () => {
  //якщо користувач не має сесії(не увійшов в акаунт)
  try {
    if (
      !window.session || //немає сесії
      !window.session.user.isConfirm //немає підтвердження пошти
    ) {
      location.assign('/') //перехід на домашнюю сторінку
    }
  } catch (error) {}

  new UserList()
})
