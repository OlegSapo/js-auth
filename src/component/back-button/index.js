class BackButton {
  static back() {
    // функція, що спрацьовує при натисканні кнопки back-button
    return window.history.back() //повернутися по історії браузера на крок назад
  }
}

window.backButton = BackButton //підключаємо клас BackButton; backButton - назва змінної до якої привязано клас BackButton
