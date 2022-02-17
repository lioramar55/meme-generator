'use strict'

//Global variables

var gIsShowTags = false
var gIsMobile = false
var gDrag = {
  isOn: false,
  startPos: {},
}

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
}

// rendering

function renderGallery() {
  var imgs = getImagesForDisplay()
  var strHTMLs = imgs.map((img) => {
    return `<img onclick="onImgClick(${img.id}, this)" src="${img.imgURL}.jpg" />`
  })
  document.querySelector('.gallery').innerHTML = strHTMLs.join('')
}

function openMemes() {
  // TODO: Render memes page
  var memes = getMemesForDisplay()
  if (!memes) return
}

function openGallery() {
  // show gallery & info section
  document.querySelector('.gallery-container').classList.remove('hide-gallery')
  // hide the meme editor
  document.querySelector('.meme-editor').style.display = 'none'
}

function toggleTags(e) {
  gIsShowTags = !gIsShowTags
  e.target.innerText = gIsShowTags ? 'Show Less' : 'Show More'
  renderInfoSection(gIsShowTags)
}

function renderInfoSection(displayAll = false) {
  //Get tags from the meme service
  var { tags, tagCount } = getTagsForDisplay()
  var i = 8
  if (displayAll) i = tagCount - 1
  // while (i) {
  var strHTML = ``
  for (var tag in tags) {
    strHTML += `<li style="font-size:${tags[tag] * 4}">${tag}</li>`
    i--
    if (i === 0) break
  }
  // }
  document.querySelector('.tags ul').innerHTML = strHTML
}

function toggleMenu() {
  document.body.classList.toggle('show-menu')
}

// opening the meme editor

function showMemeEditor() {
  // hide gallery & info section
  document.querySelector('.gallery-container').classList.add('hide-gallery')
  document.querySelector('.info').style.display = 'none'
  document.querySelector('.meme-editor').style.display = 'flex'
  // reseting values and focus on the text input
  document.querySelector('.meme-editor input[type=text]').value = ''
  document.querySelector('.meme-editor input[type=text]').focus()
}

function onImgClick(id, elImg) {
  // update gSelectedImg

  gSelectedImg = elImg
  // show the meme editor
  showMemeEditor()

  // Add Canvas Event Listeners
  addCanvasListeners()

  //setting the canvas height and width
  setCanvasDimensions()

  renderMeme(id)
}

// Drag Lines

function startDrag(e) {
  const x = e.offsetX
  const y = e.offsetY
  var selectedLine = isHoveringLine(x, y)
  if (selectedLine !== -1) {
    document.body.style.cursor = 'grabbing'
    gDrag.isOn = true
    gDrag.startPos = { x, y }
  }
}

function moveLine(e) {
  const x = e.offsetX
  const y = e.offsetY
  if (isHoveringLine(x, y) !== -1) document.body.style.cursor = 'grab'
  else document.body.style.cursor = 'default'
  if (!gDrag.isOn) return
  var selectedLine = isHoveringLine(x, y)
  if (selectedLine !== -1) {
    gMeme.lines[selectedLine].x += x - gDrag.startPos.x
    gMeme.lines[selectedLine].y += y - gDrag.startPos.y
    gDrag.startPos = { x, y }
  }
  drawCanvas()
}

function stopDrag() {
  gDrag.isOn = false
}

function onSelectLine(selectedLine) {
  var currLine = getCurrentLine()
  if (!currLine || !currLine.txt) return
  // checking if user toggles between lines
  if (selectedLine !== currLine) drawCanvas()
  selectLine()
}

// Editor Functions

function onTextStroke() {
  toggleTextStroke()
  drawCanvas()
}

function onAlignText(e) {
  var elClassList = e.path[1].classList
  var alignTo
  if (elClassList.contains('align-to-left')) alignTo = 'left'
  else if (elClassList.contains('align-to-right')) alignTo = 'right'
  else alignTo = 'center'
  alignTextTo(alignTo)
  drawCanvas()
  onSelectLine()
}

function onChangeFontSize(e) {
  var isPlus = e.path[1].classList.contains('increase-font')
  changeFontSize(isPlus)
  drawCanvas()
  onSelectLine()
}

function onDeleteLine() {
  document.querySelector('.meme-editor input[type=text]').value = ''
  deleteLine()
  drawCanvas()
}

function onUserType(e) {
  var currLine = getCurrentLine()
  currLine.txt = e.target.value
  drawCanvas()
  onSelectLine()
  printOnCanvs(currLine.txt, currLine.x, currLine.y)
}

function onSwitchLine() {
  var meme = getMeme()
  if (meme.lines.length === 1) return
  if (meme.selectedLineIdx === meme.lines.length - 1) meme.selectedLineIdx = 0
  else meme.selectedLineIdx++
  drawCanvas()
  onSelectLine()
}

function onAddLine() {
  document.querySelector('.meme-editor input[type=text]').value = ''
  var meme = getMeme()
  var { height } = getCanvasDimension()
  var y = meme.lines.length === 1 ? height - 100 : height / 2
  var newLine = {
    txt: '',
    size: 30,
    align: 'left',
    color: 'black',
    font: 'Impact',
    stroke: false,
    x: 100,
    y,
  }
  document.querySelector('.meme-editor input[type=text]').focus()
  addNewLine(newLine)
}

function onSetColor(e) {
  setMemeColor(e.target.value)
  drawCanvas()
}
