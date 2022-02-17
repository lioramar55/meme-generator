'use strict'

//Global variables

// INITIALIZTION

function init() {
  addEventListeners()
  renderInfoSection()
  renderGallery()
  initCanvas()
}

// Adding Event Listeners

function addEventListeners() {
  document.querySelector('.gallery-link').addEventListener('click', openGallery)
  document.querySelector('.memes-link').addEventListener('click', openMemes)
  document.querySelector('.nav-burger').addEventListener('click', toggleMenu)
  document.querySelector('.main-screen').addEventListener('click', toggleMenu)
  addEditorListeners()
}

function addEditorListeners() {
  document.querySelector('.tags button').addEventListener('click', toggleTags)
  document.querySelector('#data-list').addEventListener('input', onUserSearch)
  document.querySelector('.meme-editor input[type=text]').addEventListener('input', onUserType)
  document.querySelector('.meme-editor input[type=text]').addEventListener('focus', onSelectLine)
  document.querySelector('.meme-editor input[type=text]').addEventListener('focusout', drawCanvas)
  document.querySelector('.meme-editor input[type=color]').addEventListener('input', onSetColor)
  document.querySelector('.add').addEventListener('click', onAddLine)
  document.querySelector('.switch').addEventListener('click', onSwitchLine)
  document.querySelector('.text-stroke').addEventListener('click', onTextStroke)
  document.querySelector('.trash').addEventListener('click', onDeleteLine)
  document.querySelector('.increase-font').addEventListener('click', onChangeFontSize)
  document.querySelector('.decrease-font').addEventListener('click', onChangeFontSize)
  document.querySelector('.align-to-left').addEventListener('click', onAlignText)
  document.querySelector('.align-to-right').addEventListener('click', onAlignText)
  document.querySelector('.center-align-text').addEventListener('click', onAlignText)
  document.querySelector('.download').addEventListener('click', onCanvasDownload)
  document.querySelector('.flexible').addEventListener('click', onFlexibleClick)
}

// opening the meme editor

function onImgClick(id, elImg) {
  if (id) resetMeme()
  // update the selected image
  setSelectedImg(id)
  // show the meme editor
  showMemeEditor()

  // Add Canvas Event Listeners
  addCanvasListeners()

  //setting the canvas height and width
  setCanvasDimensions()

  renderMeme()
}

function showMemeEditor() {
  // hide gallery & info section
  document.querySelector('.gallery-container').classList.add('hide-gallery')
  document.querySelector('.meme-editor').style.display = 'flex'
  // reseting values and focus on the text input
  document.querySelector('.meme-editor input[type=text]').value = ''
  document.querySelector('.meme-editor input[type=text]').focus()
}

function openMemes() {
  // TODO: Render memes page
  var memes = getMemesForDisplay()
  if (!memes) return
}

function toggleMenu() {
  document.body.classList.toggle('show-menu')
}

function onTagClick(e, elTag) {
  e.stopPropagation()
  var searchTerm = elTag.innerText
  renderGallery(searchTerm)
  updateSearchCount(searchTerm)
  renderInfoSection()
}

function onFlexibleClick() {
  var meme = getFlexibleMeme()
  var elImg = getMemeImg(meme.selectedImgId)
  onImgClick(meme.selectedImgId, elImg)
  drawCanvas()
}

function onUserSearch(e) {
  var searchTerm = e.target.value
  renderGallery(searchTerm)
  updateSearchCount(searchTerm)
  renderInfoSection()
}
