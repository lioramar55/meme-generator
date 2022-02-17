'use strict'

function saveToStorage(key, val) {
  const str = JSON.stringify(val)
  localStorage.setItem(key, str)
}

function loadFromStorage(key) {
  const str = localStorage.getItem(key)
  const val = JSON.parse(str)
  return val
}
