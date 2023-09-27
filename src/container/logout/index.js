import { saveSession } from '../../script/session'

document.addEventListener('DOMContentLoaded', () => {
  //оновлення сесії на null
  saveSession(null)

  location.assign('/')
})
