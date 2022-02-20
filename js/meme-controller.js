'use strict'

//Global variables
var gDrag = {
  isOn: false,
  resizingOn: false,
  isResized: false,
  startPos: {},
  line: -1,
  txtMaxWidth: null,
  rect: { pos: {}, color: 'white', width: null, height: null },
  circle: { color: 'blue', size: 7, pos: {} },
}
var gElCanvas
var gCtx
var gSticker = {
  idx: 0,
  toDisplay: 6,
}
var gStickers = [
  '🐸',
  '💣',
  '💎',
  '💥',
  '💦',
  '💨',
  '🔥',
  '❤️',
  '👍',
  '😀',
  '😁',
  '😅',
  '🤣',
  '🤩',
  '🙃',
  '🙈',
  '🙉',
  '🙊',
  '🐶',
]

// Canvas Functions

// init
function initCanvas() {
  gElCanvas = document.querySelector('.meme-editor canvas')
  gCtx = gElCanvas.getContext('2d')
}

function renderMeme() {
  const meme = getMeme()
  const memeTxt = meme.lines[meme.selectedLineIdx].txt
  gSticker.idx = 0
  // draw the image on the canvas
  drawCleanCanvas()
  // filling the meme.txt in the input
  document.querySelector('.editor input[type=text]').value = memeTxt
}

// render stickers
function renderStickers(e) {
  var lastIdx = Math.floor(gStickers.length / gSticker.toDisplay) - 1
  if (e) {
    e.target.classList.contains('next') ? gSticker.idx++ : gSticker.idx--
  } else gSticker.idx = 0
  if (gSticker.idx >= lastIdx) {
    gSticker.idx = 0
  } else if (gSticker.idx < 0) gSticker.idx = lastIdx
  var startIdx = gSticker.idx * gSticker.toDisplay
  var strHTML = ``
  for (var i = startIdx; i <= startIdx + gSticker.toDisplay; i++) {
    if (i < gStickers.length - 1)
      strHTML += `<span onclick="onAddSticker(this)">${gStickers[i]}</span>`
  }
  document.querySelector('.stickers-container').innerHTML = strHTML
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
  if (gDrag.resizingOn) selectLine()
}

function drawLines(meme) {
  meme.lines.forEach((line, idx) => {
    initDrag(line)
    if (line.align) alignText()
    var textWidth = gCtx.measureText(line.txt).width
    gCtx.fillStyle = line.color
    if (textWidth > gDrag.rect.width - 40) {
      textWidth = gCtx.measureText(line.txt).width
      if (line.txt) {
        if (meme.lines[idx].stroke) {
          gCtx.strokeText(line.txt, line.x, line.y, gDrag.txtMaxWidth)
        } else gCtx.fillText(line.txt, line.x, line.y, gDrag.txtMaxWidth)
      }
      return
    }
    if (line.txt) {
      if (meme.lines[idx].stroke) {
        gCtx.strokeText(line.txt, line.x, line.y)
        gCtx.fillStyle = 'white'
        gCtx.fillText(line.txt, line.x, line.y)
      } else gCtx.fillText(line.txt, line.x, line.y)
    }
  })
}

function drawTxt() {}

function drawCleanCanvas() {
  const img = getMemeImg()
  const line = getCurrentLine()
  drawImageOnCanvas(img)
  initDrag(line)
  drawLines(getMeme())
  gDrag.circle.pos = { x: gDrag.rect.width + 8, y: line.y + 30 }
  selectLine()
}

function initDrag(line) {
  gCtx.font = `${line.size}px ${line.font}`
  const lineWidth = gCtx.measureText(line.txt).width
  if (!gDrag.isResized) {
    gDrag.rect.width = lineWidth + 40
    gDrag.rect.height = 80
    gDrag.circle.pos = { x: gDrag.rect.width + gDrag.rect.pos.x, y: line.y + 30 }
  }
  gDrag.rect.pos = { x: line.x - 20, y: line.y - 50 }
  gDrag.txtMaxWidth = gDrag.rect.width - 60
  if (gDrag.txtMaxWidth >= gDrag.rect.width) {
    gCtx.font = `${line.size}px ${line.font}`
  }
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
  var alignTo = e.target.dataset.align
  setLineAlignment(alignTo)
  alignText()
  drawCanvas()
  selectLine()
}

function alignText() {
  var line = getCurrentLine()
  switch (line.align) {
    case 'left':
      line.x = 30
      gDrag.rect.pos.x = line.x - 20
      break
    case 'right':
      var lineWidth = gCtx.measureText(line.txt).width
      line.x = gElCanvas.width - lineWidth - 30
      gDrag.rect.pos.x = line.x - 20
      break
    case 'center':
      line.x = gElCanvas.width / 2 - gCtx.measureText(line.txt).width / 2
      gDrag.rect.pos.x = line.x - 20
      break
  }
}

function onChangeFontSize(e) {
  var isPlus = e.path[1].classList.contains('increase-font')
  changeFontSize(isPlus)
  drawCanvas()
  selectLine()
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
  selectLine()
}

function onSwitchLine() {
  var meme = getMeme()
  if (meme.lines.length === 1) return
  if (meme.selectedLineIdx === meme.lines.length - 1) meme.selectedLineIdx = 0
  else meme.selectedLineIdx++
  drawCanvas()
  selectLine()
}

function onAddLine() {
  document.querySelector('.meme-editor input[type=text]').value = ''
  document.querySelector('.meme-editor input[type=text]').focus()
  addNewLine()
  drawCanvas()
}

function onSetColor(e) {
  setMemeColor(e.target.value)
  drawCanvas()
}

//      Canvas logic

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
  if (isTouchingDot(x, y)) {
    gDrag.resizingOn = true
  }
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
  const currLine = getCurrentLine()
  if (gDrag.resizingOn) {
    gDrag.rect.width = dx - currLine.x + 20
    gDrag.rect.height = dy - (currLine.y - 50)
    gDrag.circle.pos = { x: dx, y: dy }
  } else {
    gDrag.circle.pos = { x: gDrag.rect.width + gDrag.rect.pos.x, y: currLine.y + 30 }
  }
  gDrag.rect.pos = { x: currLine.x - 20, y: currLine.y - 50 }
  moveLineTo(dx, dy)
  gDrag.startPos = { x, y }
  drawCanvas()
  onSelectLine(gDrag.line)
}

function touchEnd() {
  onSelectLine()

  gDrag.isOn = false
  gDrag.line = -1
  gDrag.resizingOn = false
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
  if (isTouchingDot(x, y)) {
    gDrag.resizingOn = true
  }
}

function moveLine(e) {
  const x = e.offsetX
  const y = e.offsetY
  const currLine = getCurrentLine()
  if (gDrag.resizingOn) {
    gDrag.isResized = true
    gDrag.rect.width = x - currLine.x + 20
    gDrag.rect.height = y - (currLine.y - 50)
    gDrag.circle.pos = { x, y }
    drawCanvas()
  }
  if (!gDrag.isOn) return
  gDrag.circle.pos = { x: gDrag.rect.width + gDrag.rect.pos.x, y: currLine.y + 30 }
  document.body.style.cursor = 'grabbing'

  if (gDrag.line !== -1) {
    var dx = x - gDrag.startPos.x
    var dy = y - gDrag.startPos.y
    setLineAlignment('none')
    moveLineTo(dx, dy)
    gDrag.startPos = { x, y }

    gDrag.rect.pos = { x: currLine.x - 20, y: currLine.y - 50 }
  }
  drawCanvas()
}

function stopDrag() {
  gDrag.isOn = false
  gDrag.resizingOn = false
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
  var meme = getMeme()
  if (!currLine || !currLine.txt) return
  // checking if user toggles between lines
  if (selectedLine !== meme.selectedLineIdx && meme.lines.length > 1) drawCanvas()
  selectLine()
}

function selectLine() {
  drawRect()
  drawResizingDot()
}

function drawResizingDot() {
  //creating the little dot for resizing the line

  gCtx.beginPath()
  gCtx.fillStyle = gDrag.circle.color
  gCtx.arc(gDrag.circle.pos.x, gDrag.circle.pos.y, gDrag.circle.size, 0, 2 * Math.PI)
  gCtx.fill()
}

function drawRect() {
  initDrag(getCurrentLine())
  gCtx.strokeStyle = '111'
  gCtx.lineWidth = 3
  gCtx.strokeRect(gDrag.rect.pos.x, gDrag.rect.pos.y, gDrag.rect.width, gDrag.rect.height)
  gCtx.globalAlpha = 0.15
  gCtx.fillStyle = gDrag.rect.color
  // fill the background of the containing rect
  gCtx.fillRect(
    gDrag.rect.pos.x + 1,
    gDrag.rect.pos.y + 1,
    gDrag.rect.width - 1,
    gDrag.rect.height - 1
  )
  gCtx.globalAlpha = 1.0
}

function onCanvasClick(e) {
  const x = e.offsetX
  const y = e.offsetY
  var selectedLine = isTouchingLine(x, y)
  if (selectedLine !== -1) onSelectLine(selectedLine)
  else drawCanvas()
}

function isTouchingDot(x, y) {
  const distance = Math.sqrt((gDrag.circle.pos.x - x) ** 2 + (gDrag.circle.pos.y - y) ** 2)
  return distance <= gDrag.circle.size
}

function onCanvasDownload() {
  drawCanvas()
  var dataURL = gElCanvas.toDataURL('image/jpeg')
  var elLink = document.querySelector('.download')
  elLink.href = dataURL
  elLink.download = 'My-Meme.jpg'
  elLink.click()
}
