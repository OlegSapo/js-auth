class FieldSelect {
  static toggle = (target) => {
    //перемикач атрибуту active
    const options = target.nextElementSibling

    options.toggleAttribute('active')

    setTimeout(() => {
      //setTimeout є обгорткою для window.addEventListener, щоб вона спрацювала коли буде click, а не раніше
      window.addEventListener(
        //слухаемо подію click та як вона станеться прибираємо атрибут active
        'click',
        (event) => {
          if (!options.parentElement.contains(event.target))
            //target - це буде елемент на якому відбулася подія click
            options.removeAttribute('active')
        },
        { once: true }, // функція виконується один раз (once)
      )
    }, 0)
  }

  static change = (target) => {
    //метод, що буде записувати обраний результат з випадаючого списку "ролей"

    const parent = target.parentElement.parentElement //отримання батька батьківського елемента (field__container)
    const list = target.parentElement

    //=========

    const active = list.querySelector('*[active]') //parentElement - батьківський елемент (<ul>) для даного (<li>)

    if (active) active.toggleAttribute('active') //якщо атрибут active наявний, то він прибирається

    //===========

    target.toggleAttribute('active') // додавання можливості вибору елементу у випадаючому списку

    //===========

    const value = parent.querySelector('.field__value') //шукаємо елемент з класом field__value

    if (value) {
      value.innerText = target.innerText //записуємо в поле випадаючого списка обране значення
      value.classList.remove('field__value--placeholder')
    }

    //==========

    list.toggleAttribute('active') //прибриємо active щоб закрити випадаючий список
  }
}

window.fieldSelect = FieldSelect
