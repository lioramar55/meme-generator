'use strict'

// INITIALIZTION

function init() {
  addEventListeners()
  renderInfoSection()
  renderGallery()
  initCanvas()
  resetMeme()
}

// Adding Event Listeners

function addEventListeners() {
  document.querySelector('.gallery-link').addEventListener('click', openGallery)
  document.querySelector('.memes-link').addEventListener('click', openMemes)
  document.querySelector('.about-link').addEventListener('click', openAbout)
  document.querySelector('.nav-burger').addEventListener('click', toggleMenu)
  document.querySelector('footer select').addEventListener('change', onSetLang)
  document.querySelector('.main-screen').addEventListener('click', toggleMenu)
  addEditorListeners()
}

function addEditorListeners() {
  document.querySelector('.tags button').addEventListener('click', toggleTags)
  document.querySelector('.logo').addEventListener('click', openGallery)
  document.querySelector('#data-list').addEventListener('input', onUserSearch)
  document.querySelector('.meme-editor input[type=text]').addEventListener('input', onUserType)
  document.querySelector('.meme-editor input[type=text]').addEventListener('focus', onSelectLine)
  document.querySelector('.meme-editor input[type=text]').addEventListener('focusout', drawCanvas)
  document.querySelector('.meme-editor input[type=color]').addEventListener('input', onSetColor)
  document.querySelector('.meme-editor select').addEventListener('change', onSetFont)
  document.querySelector('.add').addEventListener('click', onAddLine)
  document.querySelector('.switch').addEventListener('click', onSwitchLine)
  document.querySelector('.text-stroke').addEventListener('click', onTextStroke)
  document.querySelector('.trash').addEventListener('click', onDeleteLine)
  document.querySelector('.increase-font').addEventListener('click', onChangeFontSize)
  document.querySelector('.decrease-font').addEventListener('click', onChangeFontSize)
  document.querySelector('.align-to-left').addEventListener('click', onAlignText)
  document.querySelector('.align-to-right').addEventListener('click', onAlignText)
  document.querySelector('.center-align-text').addEventListener('click', onAlignText)
  document.querySelector('.save-meme').addEventListener('click', onSaveMeme)
  document.querySelector('.download').addEventListener('click', onCanvasDownload)
  document.querySelector('.flexible').addEventListener('click', onFlexibleClick)
  document.querySelector('#upload').addEventListener('change', onUploadImg)
  document.querySelector('.share').addEventListener('click', onShareCanvas)
  document.querySelector('.stickers-left').addEventListener('click', renderStickers)
  document.querySelector('.stickers-right').addEventListener('click', renderStickers)
}

// opening the meme editor

function onSetLang(e) {
  var isEnglish = e.target.value === 'English' ? 'en' : 'he'
  setLang(isEnglish)
  doTrans()
}

function onImgClick(id) {
  // update the selected image
  setSelectedImg(id)
  // show the meme editor
  showMemeEditor()

  // Add Canvas Event Listeners
  addCanvasListeners()
  addTouchListeners()

  //setting the canvas height and width
  setCanvasDimensions()

  renderMeme()
}

function showMemeEditor() {
  // hide gallery & info section
  document.querySelector('.gallery-container').classList.add('hide-gallery')
  document.querySelector('.memes-gallery').classList.add('hide-memes')
  document.querySelector('.memes-gallery').style.display = 'none'
  document.querySelector('.meme-editor').style.display = 'flex'
  // reseting values and focus on the text input
  document.querySelector('.meme-editor input[type=text]').value = ''
  document.querySelector('.meme-editor input[type=text]').focus()

  //render stickers
  renderStickers()
}

function openMemes() {
  var memes = getMemesForDisplay()
  var elMemesGallery = document.querySelector('.memes-gallery')
  document.querySelector('.memes-gallery').classList.remove('hide-memes')
  document.querySelector('.meme-editor').style.display = 'none'
  document.querySelector('.memes-gallery').style.display = 'grid'
  document.querySelector('.about').classList.add('hide-about')
  document.querySelector('.gallery-container').classList.add('hide-gallery')
  if (!memes || !memes.length)
    elMemesGallery.innerHTML = `<h2 data-trans="memes-error">You don't have any saved memes</h2>`
  else {
    renderMemes(memes)
    toggleNotification()
  }
}

function openAbout() {
  document.querySelector('.meme-editor').style.display = 'none'
  document.querySelector('.memes-gallery').classList.add('hide-memes')
  document.querySelector('.gallery-container').classList.add('hide-gallery')
  document.querySelector('.about').classList.remove('hide-about')
}

function toggleMenu() {
  document.body.classList.toggle('show-menu')
}
