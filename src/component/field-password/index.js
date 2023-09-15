class FieldPassword {
  // клас для поля Password
  static toggle = (target) => {
    target.toggleAttribute('show') //включаємо або виключаємо атрибут, в даному випадку "show"
    const input = target.previousElementSibling
    const type = input.getAttribute('type')

    if (type === 'password') {
      // перевірка та встановлення для input атрибут type=password/text в залежності треба показати пароль чи ні
      input.setAttribute('type', 'text')
    } else {
      input.setAttribute('type', 'password')
    }
  }
}

window.fieldPassword = FieldPassword
