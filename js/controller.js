'use strict'

var gCanvas
var gCtx
var gIsShowTags = false
var gIsMobile = false
var gSelectedImg
var gDrag = {
  isOn: false,
  startPos: {},
}

function init() {
  addEventListeners()
  renderInfoSection()
  renderGallery()
  gCanvas = document.querySelector('.meme-editor canvas')
  gCtx = gCanvas.getContext('2d')
}

function addEventListeners() {
  document.querySelector('.gallery-link').addEventListener('click', openGallery)
  document.querySelector('.memes-link').addEventListener('click', openMemes)
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
  document.querySelector('.increase-font').addEventListener('click', changeFontSize)
  document.querySelector('.decrease-font').addEventListener('click', changeFontSize)
  document.querySelector('.align-to-left').addEventListener('click', alignText)
  document.querySelector('.align-to-right').addEventListener('click', alignText)
  document.querySelector('.center-align-text').addEventListener('click', alignText)
  document.querySelector('.download').addEventListener('click', onCanvasDownload)
}

function addCanvasListeners() {
  gCanvas.addEventListener('click', onCanvasClick)
  gCanvas.addEventListener('mousedown', startDrag)
  gCanvas.addEventListener('mousemove', moveLine)
  gCanvas.addEventListener('mouseup', stopDrag)
}

// Canvas Functions

function drawCanvas(e, isCleanCanvas = false) {
  var meme = getMeme()
  // checking if there is a current image
  if (meme.selectedImgId) gCtx.drawImage(gSelectedImg, 0, 0)
  if (isCleanCanvas) return

  // TODO: is mobile
  if (window.innerWidth < 780) {
    gIsMobile = true
  }
  // looping throung each line in meme.lines
  meme.lines.forEach((line) => {
    if (line.txt) {
      if (meme.lines[meme.selectedLineIdx].stroke) {
        gCtx.strokeText(line.txt, line.x, line.y, 140)
      } else gCtx.fillText(line.txt, line.x, line.y)
    }
    gCtx.font = line.size + 'px' + ' ' + line.font
    gCtx.fillStyle = line.color
  })
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
  // var txt = gCtx.measureText(currLine.txt)
  // var lineHeight = txt.actualBoundingBoxAscent
  // Setting text box outline settings
  var rectWidth = gCanvas.width - 40
  gCtx.strokeStyle = currLine.stroke ? '#f0f0f0' : '#111'
  gCtx.lineWidth = 3
  gCtx.strokeRect(20, currLine.y - 50, rectWidth, 80)
}

// Editor Functions

function onTextStroke(e) {
  toggleTextStroke()
  drawCanvas()
}

function alignText(e) {
  var elClassList = e.path[1].classList
  var alignTo
  if (elClassList.contains('align-to-left')) alignTo = 'left'
  else if (elClassList.contains('align-to-right')) alignTo = 'right'
  else alignTo = 'center'

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
  drawCanvas()
  onSelectLine()
}

function changeFontSize(e) {
  var isIncrease = e.path[1].classList.contains('increase-font')
  if (isIncrease) gMeme.lines[gMeme.selectedLineIdx].size++
  else gMeme.lines[gMeme.selectedLineIdx].size--
  drawCanvas()
  onSelectLine()
}

function onDeleteLine() {
  document.querySelector('.meme-editor input[type=text]').value = ''
  if (gMeme.lines.length === 1) {
    gMeme.lines = [
      {
        txt: '',
        size: 30,
        align: 'left',
        color: 'black',
        font: 'Impact',
        x: 100,
        y: 100 + gMeme.lines[gMeme.selectedLineIdx].y,
      },
    ]
  } else {
    var idx = gMeme.selectedLineIdx
    gMeme.lines.splice(idx, 1)
    gMeme.selectedLineIdx = 0
  }
  drawCanvas()
}

function onUserType(e) {
  var currLine = gMeme.lines[gMeme.selectedLineIdx]
  currLine.txt = e.target.value
  drawCanvas()
  onSelectLine()
  gCtx.fillText(currLine.txt, currLine.x, currLine.y)
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
  var yCoord = meme.lines.length === 1 ? gCanvas.height - 100 : gCanvas.height / 2
  var newLine = {
    txt: '',
    size: 30,
    align: 'left',
    color: 'black',
    font: 'Impact',
    stroke: false,
    x: 100,
    y: yCoord,
  }
  document.querySelector('.meme-editor input[type=text]').focus()
  addNewLine(newLine)
}

function onSetColor(e) {
  setMemeColor(e.target.value)
  drawCanvas()
}

function renderGallery() {
  var imgs = getImagesForDisplay()
  var strHTMLs = imgs.map((img) => {
    return `<img onclick="onImgClick(${img.id}, this)" src="${img.imgURL}.jpg" />`
  })
  document.querySelector('.gallery').innerHTML = strHTMLs.join('')
}

function showMemeEditor() {
  // hide gallery & info section
  document.querySelector('.gallery').classList.add('hide-gallery')
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

  //setting the canvas height and width
  setCanvasDimensions()

  // Add Canvas Event Listeners
  addCanvasListeners()

  //Initilize the canvas
  initCanvas(id)
}

function initCanvas(id) {
  var meme = getMeme()
  // draw the image on the canvas
  meme.selectedImgId = id
  drawCanvas(undefined, true)
  // initilize gCtx
  gCtx.font = `${meme.lines[0].font}px ${meme.lines[0].font}`
}

function setCanvasDimensions() {
  var height = gSelectedImg.naturalHeight
  var width = gSelectedImg.naturalWidth
  var aspectRatio = Math.min(height / width, width / height)
  // Check if the user is in mobile
  width = aspectRatio * width * 0.75

  gCanvas.height = height
  gCanvas.width = width
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

function toggleTags(e) {
  gIsShowTags = !gIsShowTags
  e.target.innerText = gIsShowTags ? 'Show Less' : 'Show More'
  renderInfoSection(gIsShowTags)
}

function renderInfoSection(displayAll = false) {
  //Get tags from the meme service
  var { tags, tagCount } = getTagsForDisplay()
  var i = 10
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
