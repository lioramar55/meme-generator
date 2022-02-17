'use strict'

var gCanvas
var gCtx
var gDrag = {
  isOn: false,
  startPos: {},
}

// Canvas Functions
// Add Event Listeners
function addCanvasListeners() {
  gCanvas.addEventListener('click', onCanvasClick)
  gCanvas.addEventListener('mousedown', startDrag)
  gCanvas.addEventListener('mousemove', moveLine)
  gCanvas.addEventListener('mouseup', stopDrag)
}
// init
function initCanvas() {
  gCanvas = document.querySelector('.meme-editor canvas')
  gCtx = gCanvas.getContext('2d')
}

function renderMeme() {
  const meme = getMeme()
  // draw the image on the canvas
  drawCleanCanvas()
  // initilize gCtx
  gCtx.font = `${meme.lines[0].size}px ${meme.lines[0].font}`
}

// Get and Set canvas dimension

function setCanvasDimensions() {
  const img = getMemeImg()
  var height = img.naturalHeight
  var width = img.naturalWidth
  const windowWidth = window.innerWidth
  const aspectRatio = height / width
  if (width > windowWidth / 2) {
    width = width * 0.75
    height = aspectRatio * width
  } else if (windowWidth > width * 2) {
    width = 500
    height = aspectRatio * width
  }
  // Check if the user is in mobile
  // if(windowWidth < )
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
  // looping throung each line in meme.lines
  meme.lines.forEach((line, idx) => {
    if (line.txt) {
      if (meme.lines[idx].stroke) {
        gCtx.strokeText(line.txt, line.x, line.y, 140)
      } else gCtx.fillText(line.txt, line.x, line.y)
    }
    gCtx.font = line.size + 'px' + ' ' + line.font
    gCtx.fillStyle = line.color
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
}

//  =====================
//       Editor Functions
// ====================

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

  document.querySelector('.meme-editor input[type=text]').focus()
  addNewLine(newLine)
}

function onSetColor(e) {
  setMemeColor(e.target.value)
  drawCanvas()
}

//  =====================
//      Canvas logic
// ====================

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

function selectLine() {
  // var txt = gCtx.measureText(currLine.txt)
  // var lineHeight = txt.actualBoundingBoxAscent
  // Setting text box outline settings
  var currLine = getCurrentLine()
  var rectWidth = gCanvas.width - 40
  gCtx.strokeStyle = currLine.stroke ? '#f0f0f0' : '#111'
  gCtx.lineWidth = 3
  gCtx.strokeRect(20, currLine.y - 50, rectWidth, 80)
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

function printOnCanvs(txt, x, y) {
  gCtx.fillText(txt, x, y)
}

function onCanvasClick(e) {
  const x = e.offsetX
  const y = e.offsetY
  var selectedLine = isHoveringLine(x, y)
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
