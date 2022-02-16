'use strict'

var gCanvas
var gCtx
var gDrag = {
  isOn: false,
  startPos: {},
}

var gMeme = {
  selectedImgId: 5,
  selectedImg: '',
  selectedLineIdx: 0,
  lines: [
    {
      txt: '',
      size: 30,
      align: 'left',
      color: 'black',
      font: 'Impact',
      x: 100,
      y: 100,
    },
  ],
}

function init() {
  addEventListeners()
  renderInfoSection()
  renderGallery()
}

function addEventListeners() {
  document.querySelector('.gallery-link').addEventListener('click', openGallery)
  document.querySelector('.memes-link').addEventListener('click', openMemes)
  addEditorListeners()
}

function addEditorListeners() {
  document.querySelector('.meme-editor input[type=text]').addEventListener('input', onUserType)
  document.querySelector('.meme-editor input[type=text]').addEventListener('focus', onSelectLine)
  document.querySelector('.meme-editor input[type=text]').addEventListener('focusout', drawCanvas)
  document.querySelector('.add').addEventListener('click', onAddLine)
  document.querySelector('.switch').addEventListener('click', onSwitchLine)
  document.querySelector('.trash').addEventListener('click', onDeleteLine)
  document.querySelector('.increase-font').addEventListener('click', changeFontSize)
  document.querySelector('.decrease-font').addEventListener('click', changeFontSize)
  document.querySelector('.align-to-left').addEventListener('click', alignText)
  document.querySelector('.align-to-right').addEventListener('click', alignText)
  document.querySelector('.center-align-text').addEventListener('click', alignText)
  document.querySelector('.download').addEventListener('click', onCanvasDownload)
}

function onCanvasDownload() {
  var dataURL = gCanvas.toDataURL('image/jpeg')
  var elLink = document.querySelector('.download')
  elLink.href = dataURL
  console.log('elLink.href', elLink.href)
  elLink.download = 'My-Meme.jpg'
  elLink.click()
}

function alignText(e) {
  var elClassList = e.path[1].classList
  var alignTo = elClassList.contains('align-to-left')
    ? 'left'
    : elClassList.contains('align-to-right')
    ? 'right'
    : 'center'

  var currLine = gMeme.lines[gMeme.selectedLineIdx]
  switch (alignTo) {
    case 'left':
      currLine.x = gCanvas.width / 10
      break
    case 'right':
      currLine.x =
        gCanvas.width - gCtx.measureText(currLine.txt).width / 2 - gCanvas.width * (2 / 10)

      break
    case 'center':
      currLine.x = gCanvas.width / 2 - gCtx.measureText(currLine.txt).width / 2
      break
  }
  drawCanvas()
  onSelectLine()
}

function addCanvasListeners() {
  gCanvas.addEventListener('click', onCanvasClick)
  gCanvas.addEventListener('mousedown', startDrag)
  gCanvas.addEventListener('mousemove', moveLine)
  gCanvas.addEventListener('mouseup', stopDrag)
}

function startDrag(e) {
  const x = e.offsetX
  const y = e.offsetY
  var selectedLine = isUserOnLine(x, y)
  if (selectedLine !== -1) {
    document.body.style.cursor = 'grabbing'
    gDrag.isOn = true
    gDrag.startPos = { x, y }
  }
}

function moveLine(e) {
  const x = e.offsetX
  const y = e.offsetY
  if (isUserOnLine(x, y) !== -1) document.body.style.cursor = 'grab'
  else document.body.style.cursor = 'default'
  if (!gDrag.isOn) return
  var selectedLine = isUserOnLine(x, y)
  if (selectedLine !== -1) {
    gMeme.lines[selectedLine].x += x - gDrag.startPos.x
    gMeme.lines[selectedLine].y += y - gDrag.startPos.y
    gDrag.startPos = { x, y }
    drawCanvas()
  }
}

function stopDrag() {
  gDrag.isOn = false
}

function changeFontSize(e) {
  var isIncrease = e.path[1].classList.contains('increase-font')
  if (isIncrease) gMeme.lines[gMeme.selectedLineIdx].size++
  else gMeme.lines[gMeme.selectedLineIdx].size--
  drawCanvas()
  onSelectLine()
}

function onCanvasClick(e) {
  const x = e.offsetX
  const y = e.offsetY
  var selectedLine = isUserOnLine(x, y)
  if (selectedLine !== -1) {
    gMeme.selectedLineIdx = selectedLine
    onSelectLine(selectedLine)
  } else {
    drawCanvas()
  }
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

function onSelectLine(selectedLine) {
  if (selectedLine !== gMeme.lines[gMeme.selectedLineIdx]) drawCanvas()
  var currLine = gMeme.lines[gMeme.selectedLineIdx]
  if (!currLine || !currLine.txt) return
  var lineHeight = gCtx.measureText(currLine.txt).fontBoundingBoxDescent
  var rectWidth = gCanvas.width * (8 / 10)
  gCtx.strokeRect(gCanvas.width / 10, currLine.y - 50, rectWidth, currLine.y + lineHeight - 25)
}

function isUserOnLine(x, y) {
  let isLineSelected = false
  let selectedLine
  gMeme.lines.forEach((line, idx) => {
    var lineWidth = gCtx.measureText(line.txt).width
    var lineHeight = gCtx.measureText(line.txt).fontBoundingBoxDescent
    if (x >= line.x && y >= line.y - 50 && x <= line.x + lineWidth && y < line.y + lineHeight) {
      isLineSelected = true
      selectedLine = idx
    }
  })
  return isLineSelected ? selectedLine : -1
}

function onSwitchLine() {
  if (gMeme.lines.length === 1) return
  if (gMeme.selectedLineIdx === gMeme.lines.length - 1) gMeme.selectedLineIdx = 0
  else gMeme.selectedLineIdx++
  drawCanvas()
  onSelectLine()
}

function onAddLine() {
  document.querySelector('.meme-editor input[type=text]').value = ''
  var yCoord = gMeme.lines.length === 1 ? gCanvas.height - 100 : gCanvas.height / 2
  var newLine = {
    txt: '',
    size: 30,
    align: 'left',
    color: 'black',
    font: 'Impact',
    x: 100,
    y: yCoord,
  }
  gMeme.selectedLineIdx++
  gMeme.lines.push(newLine)
}

function drawCanvas() {
  gCtx.drawImage(gMeme.selectedImg, 0, 0)
  gMeme.lines.forEach((line) => {
    gCtx.font = line.size + 'px' + ' ' + line.font
    if (line.txt) gCtx.fillText(line.txt, line.x, line.y)
  })
}

function renderGallery() {
  var imgs = getImagesForDisplay()
  var strHTMLs = imgs.map((img) => {
    return `<img onclick="onImgClick(${img.id}, this)" src="${img.imgURL}.jpg" />`
  })
  document.querySelector('.gallery').innerHTML = strHTMLs.join('')
}

function onImgClick(img, elImg) {
  // update gImg
  gImgs.selectedImgId = img.id

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
  // Add Canvas Event Listeners
  addCanvasListeners()
  // draw the image on the canvas
  gMeme.selectedImgId = img.id
  gMeme.selectedImg = elImg
  drawCanvas()
  // initilize gCtx
  gCtx.font = '30px Impact'
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
