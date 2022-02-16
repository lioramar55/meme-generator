'use strict'

var gCanvas
var gCtx

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
}

function addCanvasListeners() {
  gCanvas.addEventListener('click', onCanvasClick)
}

function onCanvasClick(e) {
  const x = e.offsetX
  const y = e.offsetY
  let isLineSelected = false
  let selectedLine
  gMeme.lines.forEach((line, idx) => {
    if (
      x >= line.x &&
      y >= line.y - 50 &&
      x <= line.x + gCtx.measureText(line.txt).width &&
      y < line.y + 50
    ) {
      isLineSelected = true
      selectedLine = idx
    }
  })
  if (isLineSelected) {
    gMeme.selectedLineIdx = selectedLine
    onSelectLine()
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

function onSelectLine() {
  var currLine = gMeme.lines[gMeme.selectedLineIdx]
  if (!currLine || !currLine.txt) return
  var rectWidth = gCanvas.width * (8 / 10)
  gCtx.strokeRect(20, currLine.y - 40, rectWidth, 60)
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
  var newLine = {
    txt: '',
    size: 30,
    align: 'left',
    color: 'black',
    font: 'Impact',
    x: 100,
    y: 100 + gMeme.lines[gMeme.selectedLineIdx].y,
  }
  gMeme.selectedLineIdx++
  gMeme.lines.push(newLine)
}

function drawCanvas() {
  gCtx.drawImage(gMeme.selectedImg, 0, 0)
  gMeme.lines.forEach((line) => {
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
