'use strict'

var gCanvas
var gCtx

function init() {
  console.log('Good Luck')
  addEventListeners()
  renderInfoSection()
  renderGallery()
}

function addEventListeners() {
  document.querySelector('.gallery-link').addEventListener('click', openGallery)
  document.querySelector('.memes-link').addEventListener('click', openMemes)
}

function renderGallery() {
  var imgs = getImagesForDisplay()
  var strHTMLs = imgs.map((img) => {
    return `<img onclick="onImgClick(${img.id}, this)" src="${img.imgURL}.jpg" />`
  })
  document.querySelector('.gallery').innerHTML = strHTMLs.join('')
}

function onImgClick(img, elImg) {
  // hide gallery & info section
  document.querySelector('.gallery').classList.add('hide-gallery')
  document.querySelector('.info').style.display = 'none'
  // show the meme editor
  document.querySelector('.meme-editor').style.display = 'flex'

  //creating the canvas
  gCanvas = document.querySelector('.meme-editor canvas')
  gCtx = gCanvas.getContext('2d')
  gCanvas.height = elImg.naturalHeight
  gCanvas.width = elImg.naturalWidth
}

function openMemes() {
  // TODO: Render memes page
  var memes = getMemesForDisplay()
  if (!memes) return
}

function openGallery() {
  // show gallery & info section
  document.querySelector('.gallery').classList.remove('hide-gallery')
  document.querySelector('.info').style.display = 'flex'
  // hide the meme editor
  document.querySelector('.meme-editor').style.display = 'none'
}

function renderInfoSection() {
  //TODO: Get tags from the meme service
  // var tags = getTagsForDisplay()
  var strHTML = `<div class="search">
            <h2>Choose a template</h2>
            <input type="text" placeholder="meme templates" />
          </div>
          <div class="tags">
            <ul class="clean-list flex">
              <li>tag</li>
              <li>tag</li>
              <li>tag</li>
              <li>tag</li>
              <li>tag</li>
            </ul>
          </div>`
  document.querySelector('.info').innerHTML = strHTML
}
