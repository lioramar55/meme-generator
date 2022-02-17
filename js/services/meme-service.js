'use strict'
// Global variables
const dataKey = 'memesDB'
var gTagCount
var gKeywordSearchCountMap = {}
var gImgs = [
  {
    id: 1,
    imgURL: 'assets/imgs/meme-imgs-vr/1',
    keywords: ['funny', 'trump', 'donald', 'president'],
  },
  { id: 2, imgURL: 'assets/imgs/meme-imgs-vr/2', keywords: ['dogs', 'cute'] },
  {
    id: 3,
    imgURL: 'assets/imgs/meme-imgs-vr/3',
    keywords: ['dogs', 'baby', 'cute', 'sleep'],
  },
  { id: 4, imgURL: 'assets/imgs/meme-imgs-vr/4', keywords: ['funny', 'cat', 'sleep'] },
  { id: 5, imgURL: 'assets/imgs/meme-imgs-vr/5', keywords: ['funny', 'baby', 'success'] },
  {
    id: 6,
    imgURL: 'assets/imgs/meme-imgs-vr/6',
    keywords: ['funny', 'confused', 'wait what'],
  },
  {
    id: 7,
    imgURL: 'assets/imgs/meme-imgs-vr/7',
    keywords: ['wait what', 'surprised', 'baby'],
  },
  { id: 8, imgURL: 'assets/imgs/meme-imgs-vr/8', keywords: ['tell me more', 'funny'] },
  { id: 9, imgURL: 'assets/imgs/meme-imgs-vr/9', keywords: ['evil', 'baby', 'funny'] },
  {
    id: 10,
    imgURL: 'assets/imgs/meme-imgs-vr/10',
    keywords: ['laugh', 'smile', 'funny', 'barak obama', 'president', 'obama'],
  },
  { id: 11, imgURL: 'assets/imgs/meme-imgs-vr/11', keywords: ['kiss', 'awkward', 'funny'] },
  {
    id: 12,
    imgURL: 'assets/imgs/meme-imgs-vr/12',
    keywords: ['tv', 'what would u do', 'funny'],
  },
  {
    id: 13,
    imgURL: 'assets/imgs/meme-imgs-vr/13',
    keywords: ['tv', 'success', 'celebrate', 'leonardo'],
  },
  { id: 14, imgURL: 'assets/imgs/meme-imgs-vr/14', keywords: ['tv', 'matrix', 'serious'] },
  {
    id: 15,
    imgURL: 'assets/imgs/meme-imgs-vr/15',
    keywords: ['tv', 'game of thrones', 'serious', 'understand this'],
  },
  { id: 16, imgURL: 'assets/imgs/meme-imgs-vr/16', keywords: ['tv', 'funny', 'ridiculous'] },
  {
    id: 17,
    imgURL: 'assets/imgs/meme-imgs-vr/17',
    keywords: ['putin', 'russia', 'power', 'announcment'],
  },
  {
    id: 18,
    imgURL: 'assets/imgs/meme-imgs-vr/18',
    keywords: ['toy story', 'buzz', 'buzz oldrin', 'explaining'],
  },
  {
    id: 19,
    imgURL: 'assets/imgs/meme-imgs-vr/19',
    keywords: ['finally free', 'free'],
  },
  {
    id: 20,
    imgURL: 'assets/imgs/meme-imgs-vr/20',
    keywords: ['funny', 'trump', 'donald', 'president'],
  },
  {
    id: 21,
    imgURL: 'assets/imgs/meme-imgs-vr/21',
    keywords: ['what are you doing', 'wtf'],
  },
  {
    id: 22,
    imgURL: 'assets/imgs/meme-imgs-vr/22',
    keywords: ['evil', 'sarcasm', 'pretending'],
  },
  {
    id: 23,
    imgURL: 'assets/imgs/meme-imgs-vr/23',
    keywords: ['africans kid dancing', 'funny kids', 'kids'],
  },
  {
    id: 24,
    imgURL: 'assets/imgs/meme-imgs-vr/24',
    keywords: ['dog', 'cute', 'funny'],
  },
  {
    id: 25,
    imgURL: 'assets/imgs/meme-imgs-vr/25',
    keywords: ['fixed it', 'thank god', 'success'],
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

// GET Functions

function getImagesForDisplay() {
  return gImgs
}

function getCurrentLine() {
  return gMeme.lines[gMeme.selectedLineIdx]
}

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

function getMeme() {
  return gMeme
}

function getMemesForDisplay() {}

// CHECK Functions

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

// SET Functions

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

function changeFontSize(isPlus) {
  if (isPlus) gMeme.lines[gMeme.selectedLineIdx].size++
  else gMeme.lines[gMeme.selectedLineIdx].size--
}

function deleteLine() {
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
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    gMeme.selectedLineIdx = 0
  }
}
