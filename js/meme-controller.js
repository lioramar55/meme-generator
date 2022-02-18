'use strict'

var gCanvas
var gCtx
var gDrag = {
  isOn: false,
  startPos: {},
}

// Canvas Functions

// init
function initCanvas() {
  gCanvas = document.querySelector('.meme-editor canvas')
  gCtx = gCanvas.getContext('2d')
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
  gCanvas.addEventListener('click', onCanvasClick)
  gCanvas.addEventListener('keydown', onKeyPress)
  gCanvas.addEventListener('mousedown', startDrag)
  gCanvas.addEventListener('mousemove', moveLine)
  gCanvas.addEventListener('mouseup', stopDrag)
}

function addTouchListeners() {
  gCanvas.addEventListener('touchstart', touchStart)
  gCanvas.addEventListener('touchmove', touchMove)
  gCanvas.addEventListener('touchend', touchEnd)
}

// Get and Set canvas dimension

function setCanvasDimensions() {
  const img = getMemeImg()
  var height = img.naturalHeight
  var width = img.naturalWidth
  const windowWidth = window.innerWidth
  const aspectRatio = height / width

  // Check the user device
  if (windowWidth > 880) {
    width = width * 0.75
    height = aspectRatio * width
  } else if (windowWidth < 880 && windowWidth > 660) {
    width = 550
    height = aspectRatio * width
  } else if (windowWidth < 660) {
    width = windowWidth - 50
    height = aspectRatio * width
  }

  gCanvas.height = height
  gCanvas.width = width
}

function getCanvasDimension() {
  return { height: gCanvas.height, width: gCanvas.width }
}

// Draw canvas

function drawCanvas() {
  const meme = getMeme()
  const img = getMemeImg()
  // drawing the image in the same dimension like original
  gCtx.drawImage(
    img,
    0,
    0,
    img.width,
    img.height, // source image
    0,
    0,
    gCanvas.width,
    gCanvas.height
  )
  drawLines(meme)
}

function drawLines(meme, align) {
  meme.lines.forEach((line, idx) => {
    gCtx.font = `${line.size}px ${line.font}`
    gCtx.fillStyle = line.color
    if (line.txt) {
      if (meme.lines[idx].stroke) {
        gCtx.strokeText(line.txt, line.x, line.y, 140)
      } else gCtx.fillText(line.txt, line.x, line.y)
    }
    if (align) alignTextTo(line.align)
  })
}

function drawCleanCanvas() {
  const img = getMemeImg()
  // drawing the image in the same dimension like original
  gCtx.drawImage(
    img,
    0,
    0,
    img.width,
    img.height, // source image
    0,
    0,
    gCanvas.width,
    gCanvas.height
  )
  drawLines(getMeme(), true)
}

//  =====================
//       Editor Functions
// ====================

function onSetFont(e) {
  setLineFont(e.target.value)
  drawCanvas()
}

function onSaveMeme() {
  var dataURL = gCanvas.toDataURL('image/jpeg')
  saveMeme(dataURL)
  toggleNotification()
}

function toggleNotification() {
  document.querySelector('.memes-link').classList.add('notification')
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

function touchStart(e) {
  e.preventDefault()
  const touch = e.touches[0]
  var rect = gCanvas.getBoundingClientRect()
  const x = touch.clientX - rect.left
  const y = touch.clientY - rect.top
  var selectedLine = isTouchingLine(x, y)
  if (selectedLine !== -1) {
    onSelectLine(selectedLine)
    gDrag.isOn = true
    gDrag.startPos = { x, y }
  } else {
    drawCanvas()
  }
}

function touchMove(e) {
  if (!gDrag.isOn) return
  const touch = e.touches[0]
  const rect = gCanvas.getBoundingClientRect()
  const selectedLine = getCurrentLine()
  const x = touch.clientX - rect.left
  const y = touch.clientY - rect.top
  const dx = x - gDrag.startPos.x
  const dy = y - gDrag.startPos.y
  moveLineTo(dx, dy)
  gDrag.startPos = { x, y }
  drawCanvas()
  onSelectLine(selectedLine)
}
function touchEnd() {
  gDrag.isOn = false
}

function startDrag(e) {
  const x = e.offsetX
  const y = e.offsetY

  document.body.style.cursor = 'grabbing'
  gDrag.isOn = true
  gDrag.startPos = { x, y }
}

function moveLine(e) {
  const x = e.offsetX
  const y = e.offsetY
  if (isTouchingLine(x, y) !== -1) document.body.style.cursor = 'grab'
  else document.body.style.cursor = 'default'
  if (!gDrag.isOn) return
  var selectedLine = isTouchingLine(x, y)
  if (selectedLine !== -1) {
    var dx = x - gDrag.startPos.x
    var dy = y - gDrag.startPos.y
    moveLineTo(dx, dy)
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

function selectLine() {
  var currLine = getCurrentLine()
  var rectWidth = gCanvas.width - 40
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
      var xCoord = gCanvas.width - lineWidth - 30
      currLine.x = xCoord
      break
    case 'center':
      currLine.x = gCanvas.width / 2 - gCtx.measureText(currLine.txt).width / 2
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
  var dataURL = gCanvas.toDataURL('image/jpeg')
  var elLink = document.querySelector('.download')
  elLink.href = dataURL
  elLink.download = 'My-Meme.jpg'
  elLink.click()
}
