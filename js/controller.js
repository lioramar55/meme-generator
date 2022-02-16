'use strict'

var gCanvas
var gCtx

function init() {
  console.log('Good Luck')

  renderGallery()
}

function renderGallery() {
  var imgs = getImagesForDisplay()
  var strHTMLs = imgs.map((img) => {
    return `<img onclick="onImgClick(${img.id}, this)" src="${img.imgURL}.jpg" />`
  })
  document.querySelector('.gallery').innerHTML = strHTMLs.join('')
}

function onImgClick(img, elImg) {
  document.querySelector('.gallery').classList.add('hide-gallery')
  document.querySelector('.meme-editor').style.display = 'flex'
  gCanvas = document.querySelector('.meme-editor canvas')
  gCtx = gCanvas.getContext('2d')
  gCanvas.height = elImg.naturalHeight
  gCanvas.width = elImg.naturalWidth
}
