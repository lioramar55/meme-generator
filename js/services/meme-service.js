'use strict'

const dataKey = 'memesDB'
var gTagCount
var gKeywordSearchCountMap = {}
var gImgs = [
  { id: 1, imgURL: 'assets/imgs/meme-imgs-sq/1', keywords: ['funny', 'donald', 'president'] },
  { id: 2, imgURL: 'assets/imgs/meme-imgs-sq/2', keywords: ['dogs', 'cute'] },
  {
    id: 3,
    imgURL: 'assets/imgs/meme-imgs-sq/3',
    keywords: ['dogs', 'baby', 'cute', 'sleep'],
  },
  { id: 4, imgURL: 'assets/imgs/meme-imgs-sq/4', keywords: ['funny', 'cat', 'sleep'] },
  { id: 5, imgURL: 'assets/imgs/meme-imgs-sq/5', keywords: ['funny', 'baby', 'success'] },
  {
    id: 6,
    imgURL: 'assets/imgs/meme-imgs-sq/6',
    keywords: ['funny', 'confused', 'wait what'],
  },
  {
    id: 7,
    imgURL: 'assets/imgs/meme-imgs-sq/7',
    keywords: ['wait what', 'surprised', 'baby'],
  },
  { id: 8, imgURL: 'assets/imgs/meme-imgs-sq/8', keywords: ['tell me more', 'funny'] },
  { id: 9, imgURL: 'assets/imgs/meme-imgs-sq/9', keywords: ['evil', 'baby', 'funny'] },
  {
    id: 10,
    imgURL: 'assets/imgs/meme-imgs-sq/10',
    keywords: ['laugh', 'smile', 'funny', 'barak obama', 'president', 'obama'],
  },
  { id: 11, imgURL: 'assets/imgs/meme-imgs-sq/11', keywords: ['kiss', 'awkward', 'funny'] },
  {
    id: 12,
    imgURL: 'assets/imgs/meme-imgs-sq/12',
    keywords: ['tv', 'what would u do', 'funny'],
  },
  {
    id: 13,
    imgURL: 'assets/imgs/meme-imgs-sq/13',
    keywords: ['tv', 'success', 'celebrate', 'leonardo'],
  },
  { id: 14, imgURL: 'assets/imgs/meme-imgs-sq/14', keywords: ['tv', 'matrix', 'serious'] },
  {
    id: 15,
    imgURL: 'assets/imgs/meme-imgs-sq/15',
    keywords: ['tv', 'game of thrones', 'serious', 'understand this'],
  },
  { id: 16, imgURL: 'assets/imgs/meme-imgs-sq/16', keywords: ['tv', 'funny', 'ridiculous'] },
  {
    id: 17,
    imgURL: 'assets/imgs/meme-imgs-sq/17',
    keywords: ['putin', 'russia', 'power', 'announcment'],
  },
  {
    id: 18,
    imgURL: 'assets/imgs/meme-imgs-sq/18',
    keywords: ['toy story', 'buzz', 'buzz oldrin', 'explaining'],
  },
]
var gMeme = {
  selectedImgId: null,
  selectedLineIdx: 0,
  lines: [
    {
      txt: '',
      size: 30,
      stroke: false,
      align: 'left',
      color: '#111',
      font: 'Impact',
      x: 100,
      y: 100,
    },
  ],
}

function getMeme() {
  return gMeme
}

function getCurrentLine() {
  return gMeme.lines[gMeme.selectedLineIdx]
}

function getImagesForDisplay() {
  return gImgs
}

function getMemesForDisplay() {}

function getTagsForDisplay() {
  gTagCount = 0
  gImgs.forEach((img) => {
    img.keywords.forEach((keyword) => {
      if (gKeywordSearchCountMap[keyword]) gKeywordSearchCountMap[keyword]++
      else {
        gTagCount++
        gKeywordSearchCountMap[keyword] = 1
      }
    })
  })
  return { tags: gKeywordSearchCountMap, tagCount: gTagCount }
}

function isHoveringLine(x, y) {
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

function setMemeColor(color) {
  gMeme.lines[gMeme.selectedLineIdx].color = color
}

function toggleTextStroke() {
  gMeme.lines[gMeme.selectedLineIdx].stroke = !gMeme.lines[gMeme.selectedLineIdx].stroke
}

function addNewLine(newLine) {
  gMeme.selectedLineIdx++
  gMeme.lines.push(newLine)
}
