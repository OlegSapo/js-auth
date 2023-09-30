//підключаємо клас List
import { List } from '../../script/list'
//підключваємо константи ролей юзера
import { USER_ROLE } from '../../script/user'

//створюємо клас даних користувача що буде наслідувати клас List
class UserItem extends List {
  constructor() {
    super() //визиваємо щоб працював конструктор у батьківського класу List

    //додаємо в елемент(elemet)-відображення ідентифіктор 'id='user-list' '
    this.element = document.querySelector('#user-item')

    //якщо немає елемента(element) то видаєм помилку
    if (!this.element) throw new Error('Element is null')

    //створюємо об'єкт URL, щоб витягнути id
    this.id = new URLSearchParams(location.search).get('id')

    //якщо id немає
    if (!this.id) location.assign('/user-list')

    //починаємо завантаження даних
    this.loadData()
  }

  //завантаження даних
  loadData = async () => {
    //робимо оновлення статусу на LOADING
    this.updateStatus(this.STATE.LOADING)

    console.log(this.id)
    // return null

    try {
      //робимо ГЕТ-запит на певну сторінку
      const res = await fetch(
        `/user-item-data?id=${this.id}`,
        {
          method: 'GET',
        },
      )

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
      //але робимо певні зміни всередині юзера
      user: {
        //повертаємо все що було всередині юзера
        ...data.user,
        //оновлюємо роль (замість кодів будуть назви ролей, що представлені в константах USER_ROLE)
        role: USER_ROLE[data.user.role],
        //робимо додатково властивість "confirm" із значеням Так/Ні
        confirm: data.user.isConfirm ? 'Так' : 'Ні',
      },
    }
  }

  //оновлення відображення даних на сторінці
  updateView = () => {
    //очищаємо зміст елементів сторінки перед виводом даних
    this.element.innerHTML = ''

    switch (this.status) {
      case this.STATE.LOADING:
        //код, що оновлює верстку елемента сторінки
        this.element.innerHTML = `
          <div class="data">
            <span class="data__title">ID</span>
            <span class="data__value skeleton"></span>
          </div>

          <div class="data">
            <span class="data__title">Email</span>
            <span class="data__value skeleton"></span>
          </div>

          <div class="data">
            <span class="data__title">Роль</span>
            <span class="data__value skeleton"></span>
          </div>

          <div class="data">
            <span class="data__title">Пошта підтверджена?</span>
            <span class="data__value skeleton"></span>
          </div>
        `
        break

      case this.STATE.SUCCESS:
        //деструктуризація
        const { id, email, role, confirm } = this.data.user

        //код, що оновлює верстку елемента сторінки
        this.element.innerHTML = `
          <div class="data">
            <span class="data__title">ID</span>
            <span class="data__value">${id}</span>
          </div>

          <div class="data">
            <span class="data__title">Email</span>
            <span class="data__value">${email}</span>
          </div>

          <div class="data">
            <span class="data__title">Роль</span>
            <span class="data__value">${role}</span>
          </div>

          <div class="data">
            <span class="data__title">Пошта підтверджена?</span>
            <span class="data__value">${confirm}</span>
          </div>
        `
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

  new UserItem()
})
