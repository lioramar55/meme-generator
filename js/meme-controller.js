'use strict'

var gElCanvas
var gCtx
var gDrag = {
  isOn: false,
  startPos: {},
  line: -1,
}

// Canvas Functions

// init
function initCanvas() {
  gElCanvas = document.querySelector('.meme-editor canvas')
  gCtx = gElCanvas.getContext('2d')
}

function renderMeme() {
  const meme = getMeme()
  const memeTxt = meme.lines[meme.selectedLineIdx].txt
  // draw the image on the canvas
  // initilize gCtx
  drawCleanCanvas()
  drawCanvas()
  // Writing the meme txt in the input
  document.querySelector('.editor input[type=text]').value = memeTxt
}

// Add Event Listeners

function addCanvasListeners() {
  gElCanvas.addEventListener('click', onCanvasClick)
  gElCanvas.addEventListener('keydown', onKeyPress)
  gElCanvas.addEventListener('mousedown', startDrag)
  gElCanvas.addEventListener('mousemove', moveLine)
  gElCanvas.addEventListener('mouseup', stopDrag)
}

function addTouchListeners() {
  gElCanvas.addEventListener('touchstart', touchStart)
  gElCanvas.addEventListener('touchmove', touchMove, false)
  gElCanvas.addEventListener('touchend', touchEnd, false)
}

// Get and Set canvas dimension

function setCanvasDimensions(image) {
  let img
  if (image) img = image
  else img = getMemeImg()
  var height = img.naturalHeight
  var width = img.naturalWidth
  const windowWidth = window.innerWidth
  const aspectRatio = height / width

  // Check the user device
  if (windowWidth > 880) {
    if (windowWidth > width * 2) {
      width = width * 1.5 >= 600 ? width : 600
      height = aspectRatio * width
    } else {
      width = width * 0.75
      height = aspectRatio * width
    }
  } else if (windowWidth <= 880 && windowWidth > 660) {
    width = windowWidth - 80
    height = aspectRatio * width
  } else {
    width = windowWidth - 50
    height = aspectRatio * width
  }
  gElCanvas.height = height
  gElCanvas.width = width
}

function getCanvasDimension() {
  return { height: gElCanvas.height, width: gElCanvas.width }
}

// Draw canvas

function drawCanvas() {
  const meme = getMeme()
  const img = getMemeImg()
  drawImageOnCanvas(img)
  drawLines(meme)
}

function drawLines(meme, align) {
  meme.lines.forEach((line, idx) => {
    gCtx.font = `${line.size}px ${line.font}`
    gCtx.fillStyle = line.color
    if (line.txt) {
      if (meme.lines[idx].stroke) {
        gCtx.strokeText(line.txt, line.x, line.y)
      } else gCtx.fillText(line.txt, line.x, line.y)
    }
    if (align) alignTextTo(line.align)
  })
}

function drawCleanCanvas() {
  const img = getMemeImg()
  drawImageOnCanvas(img)
  drawLines(getMeme(), true)
}

function drawImageOnCanvas(img) {
  gCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, gElCanvas.width, gElCanvas.height)
}

// storing meme

function onSaveMeme() {
  var dataURL = gElCanvas.toDataURL('image/jpeg')
  saveMemeToStorage(dataURL)
  toggleNotification()
}

//       Editor Functions

function onSetFont(e) {
  setLineFont(e.target.value)
  drawCanvas()
}

//TODO
function onShareCanvas() {
  const imgDataURL = gElCanvas.toDataURL('image/jpeg')
  uploadImg(imgDataURL)
  document.querySelector('.fb').hidden = false
  document.querySelector('.whatsapp').hidden = false
}

function onUploadImg(e) {
  var file = e.target.files[0]
  var reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = (e) => {
    var elImg = new Image()
    elImg.src = e.target.result
    elImg.onload = () => {
      setCanvasDimensions(elImg)
      drawImageOnCanvas(elImg)
    }
  }
}

function toggleNotification() {
  document.querySelector('.memes-link').classList.toggle('notification')
}

function onAddSticker(elSticker) {
  addNewLine()
  var text = elSticker.innerText
  setLineText(text)
  drawCanvas()
}

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
  if (currLine === -1 || !currLine) return
  setLineText(e.target.value)
  drawCanvas()
  onSelectLine()
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

  document.querySelector('.meme-editor input[type=text]').focus()
  addNewLine()
}

function onSetColor(e) {
  setMemeColor(e.target.value)
  drawCanvas()
}

//  =====================
//      Canvas logic
// ====================

// Touch events

function getTouchCoords(e, x, y) {
  var rect = gElCanvas.getBoundingClientRect()
  const touch = e.touches[0]
  x = touch.clientX - rect.left
  y = touch.clientY - rect.top
  return { x, y }
}

function touchStart(e) {
  e.preventDefault()
  const { x, y } = getTouchCoords(e)
  gDrag.line = isTouchingLine(x, y)
  if (gDrag.line !== -1) {
    onSelectLine(gDrag.line)
    gDrag.isOn = true
    gDrag.startPos = { x, y }
  } else {
    drawCanvas()
  }
}

function touchMove(e) {
  if (!gDrag.isOn) return
  const { x, y } = getTouchCoords(e)
  const dx = x - gDrag.startPos.x
  const dy = y - gDrag.startPos.y
  moveLineTo(dx, dy)
  gDrag.startPos = { x, y }
  drawCanvas()
  onSelectLine(gDrag.line)
}

function touchEnd() {
  gDrag.isOn = false
  gDrag.line = -1
}

// Mouse Events

function startDrag(e) {
  const x = e.offsetX
  const y = e.offsetY

  gDrag.line = isTouchingLine(x, y)
  if (gDrag.line !== -1) {
    gDrag.isOn = true
    gDrag.startPos = { x, y }
  }
}

function moveLine(e) {
  const x = e.offsetX
  const y = e.offsetY

  if (!gDrag.isOn) return
  document.body.style.cursor = 'grabbing'

  if (gDrag.line !== -1) {
    var dx = x - gDrag.startPos.x
    var dy = y - gDrag.startPos.y
    moveLineTo(dx, dy)
    gDrag.startPos = { x, y }
  }
  drawCanvas()
}

function stopDrag() {
  gDrag.isOn = false
  gDrag.line = -1
  document.body.style.cursor = 'default'
}

// Inline Editing

function onKeyPress(e) {
  var selectedLine = gMeme.lines[gMeme.selectedLineIdx]
  if (selectedLine === -1) return
  var elInput = document.querySelector('.editor input[type=text]')
  var str = selectedLine.txt
  if (e.key === 'Backspace') {
    str = str.slice(0, str.length - 1)
  } else if (e.key.length === 1) {
    str = str + e.key
  }
  elInput.value = str
  setLineText(str)
  drawCanvas()
  selectLine()
}

function onSelectLine(selectedLine) {
  var currLine = getCurrentLine()
  if (!currLine || !currLine.txt) return
  // checking if user toggles between lines
  if (selectedLine !== currLine) drawCanvas()
  selectLine()
}

function selectLine() {
  var currLine = getCurrentLine()
  var rectWidth = gElCanvas.width - 40
  gCtx.strokeStyle = currLine.stroke ? '#f0f0f0' : '#111'
  gCtx.lineWidth = 3
  gCtx.strokeRect(20, currLine.y - 50, rectWidth, 80)
  gCtx.globalAlpha = 0.15
  gCtx.fillStyle = 'black'
  gCtx.fillRect(21, currLine.y - 49, rectWidth - 1, 79)
  gCtx.globalAlpha = 1.0
}

function alignTextTo(alignTo) {
  var currLine = getCurrentLine()
  switch (alignTo) {
    case 'left':
      currLine.x = 30
      break
    case 'right':
      var lineWidth = gCtx.measureText(currLine.txt).width
      var xCoord = gElCanvas.width - lineWidth - 30
      currLine.x = xCoord
      break
    case 'center':
      currLine.x = gElCanvas.width / 2 - gCtx.measureText(currLine.txt).width / 2
      break
  }
}

function onCanvasClick(e) {
  const x = e.offsetX
  const y = e.offsetY
  var selectedLine = isTouchingLine(x, y)
  if (selectedLine !== -1) {
    gMeme.selectedLineIdx = selectedLine
    onSelectLine(selectedLine)
  } else {
    drawCanvas()
  }
}

function onCanvasDownload() {
  var dataURL = gElCanvas.toDataURL('image/jpeg')
  var elLink = document.querySelector('.download')
  elLink.href = dataURL
  elLink.download = 'My-Meme.jpg'
  elLink.click()
}
