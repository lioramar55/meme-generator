'use strict'

var gCanvas
var gCtx
var gSelectedImg

// Canvas Functions

function addCanvasListeners() {
  gCanvas.addEventListener('click', onCanvasClick)
  gCanvas.addEventListener('mousedown', startDrag)
  gCanvas.addEventListener('mousemove', moveLine)
  gCanvas.addEventListener('mouseup', stopDrag)
}

function initCanvas() {
  gCanvas = document.querySelector('.meme-editor canvas')
  gCtx = gCanvas.getContext('2d')
}

function renderMeme(id) {
  var meme = getMeme()
  // draw the image on the canvas
  meme.selectedImgId = id
  drawCleanCanvas()
  // initilize gCtx
  gCtx.font = `${meme.lines[0].font}px ${meme.lines[0].font}`
}

function setCanvasDimensions() {
  var height = gSelectedImg.naturalHeight
  var width = gSelectedImg.naturalWidth
  var windowWidth = window.innerWidth
  var aspectRatio = height / width
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

function drawCanvas() {
  var meme = getMeme()
  // drawing the image in the same dimension like original
  gCtx.drawImage(
    gSelectedImg,
    0,
    0,
    gSelectedImg.width,
    gSelectedImg.height, // source image
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
  // drawing the image in the same dimension like original
  gCtx.drawImage(
    gSelectedImg,
    0,
    0,
    gSelectedImg.width,
    gSelectedImg.height, // source image
    0,
    0,
    gCanvas.width,
    gCanvas.height
  )
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
