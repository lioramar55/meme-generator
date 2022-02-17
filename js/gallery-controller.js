'use strict'
var gIsShowTags = false

function renderGallery(isFilter) {
  var imgs = getImagesForDisplay()
  if (isFilter) imgs = imgs.filter((img) => img.keywords.includes(isFilter))
  var strHTMLs = imgs.map((img) => {
    return `<img onclick="onImgClick(${img.id}, this)" src="${img.imgURL}.jpg" />`
  })
  document.querySelector('.gallery').innerHTML = strHTMLs.join('')
}

function renderInfoSection(displayAll = false) {
  //Get tags from the meme service
  var { tags, tagCount } = getTagsForDisplay()
  var i = 8
  if (displayAll) i = tagCount - 1
  var tagListHTML = ``
  var dataListHTML = ``
  for (var tag in tags) {
    var fontSize = tags[tag] / 2 + 10
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

function openGallery() {
  // show gallery & info section
  document.querySelector('.gallery-container').classList.remove('hide-gallery')
  // hide the meme editor
  document.querySelector('.meme-editor').style.display = 'none'
  renderGallery()
}

function toggleTags(e) {
  gIsShowTags = !gIsShowTags
  e.target.innerText = gIsShowTags ? 'Show Less' : 'Show More'
  renderInfoSection(gIsShowTags)
}
