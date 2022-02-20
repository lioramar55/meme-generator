'use strict'
var gIsShowTags = false

// Rendering

// Gallery
function renderGallery(isFilter) {
  var imgs = getImagesForDisplay()
  if (isFilter) imgs = imgs.filter((img) => img.keywords.includes(isFilter))
  var strHTMLs = imgs.map((img) => {
    return `<img onclick="onImgClick(${img.id}, this)" src="${img.imgURL}.jpg" />`
  })
  document.querySelector('.gallery').innerHTML = strHTMLs.join('')
}

// Info section
function renderInfoSection(displayAll = false) {
  //Get tags from the meme service
  var { tags, tagCount } = getTagsForDisplay()
  var i = 8
  if (displayAll) i = tagCount - 1
  var tagListHTML = ``
  var dataListHTML = ``
  for (var tag in tags) {
    var fontSize = tags[tag] < 8 ? 8 : tags[tag] * 1.125
    tagListHTML += `<li onclick="onTagClick(event, this)" style="font-size:${fontSize}px">${tag}</li>`
    i--
    if (i === 0) break
  }
  for (var tag in tags) {
    dataListHTML += `<option value="${tag}">`
  }
  document.querySelector('.search datalist').innerHTML = dataListHTML
  document.querySelector('.tags ul').innerHTML = tagListHTML
}

//Memes

function renderMemes(memeImgs) {
  var strHTMLs = memeImgs.map((img) => {
    document.querySelector('.memes-gallery').innerHTML = ''
    var elImg = new Image()
    elImg.src = img
    elImg.onload = () => {
      strHTMLs += elImg
      document.querySelector('.memes-gallery').appendChild(elImg)
    }
  })
  // document.querySelector('.memes-gallery').innerHTML = strHTMLs.join('')
}

// Show and hide sections

function openGallery() {
  // show gallery & info section
  document.querySelector('.gallery-container').classList.remove('hide-gallery')
  document.querySelector('.memes-gallery').classList.add('hide-memes')
  document.querySelector('.memes-gallery').style.display = 'none'
  document.querySelector('.about').classList.add('hide-about')

  // hide the meme editor
  document.querySelector('.meme-editor').style.display = 'none'
  renderGallery()
  resetMeme()
}

function onTagClick(e, elTag) {
  e.stopPropagation()
  var searchTerm = elTag.innerText
  renderGallery(searchTerm)
  updateSearchCount(searchTerm)
  renderInfoSection()
}

function onFlexibleClick() {
  var meme = getFlexibleMeme(gElCanvas.height)
  onImgClick(meme.selectedImgId)
}

function onUserSearch(e) {
  var searchTerm = e.target.value
  renderGallery(searchTerm)
  updateSearchCount(searchTerm)
  renderInfoSection()
}

function toggleTags(e) {
  gIsShowTags = !gIsShowTags
  var currLang = getCurrLang()
  if (currLang === 'en') e.target.innerText = gIsShowTags ? 'Show Less' : 'Show More'
  else e.target.innerText = gIsShowTags ? 'ראה פחות' : 'ראה יותר'

  renderInfoSection(gIsShowTags)
}
