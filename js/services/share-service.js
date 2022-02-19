'use strict'

function uploadImg(imgDataUrl) {
  // A function to be called if request succeeds
  function onSuccess(uploadedImgUrl) {
    const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
    const shareData = {
      title: 'My Meme',
      text: 'Check out my crazy meme',
      url: `${encodedUploadedImgUrl}`,
    }
    console.log(encodedUploadedImgUrl)
    var elFbBtn = document.querySelector('.fb')
    var elWhatsappBtn = document.querySelector('.whatsapp')
    elFbBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}`
    // elFbBtn.onclick = window.open(
    //   `https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}`
    // )
    elWhatsappBtn.href = `whatsapp://send?text='${+encodedUploadedImgUrl}`
    // async () => {
    //   try {
    //     await navigator.share(`whatsapp://send?text=${shareData.text} - ${shareData.url}`)
    //     console.log('Success')
    //   } catch (err) {
    //     console.log('err', err)
    //   }
    // }
    return false
  }

  doUploadImg(imgDataUrl, onSuccess)
}

function doUploadImg(imgDataUrl, onSuccess) {
  const formData = new FormData()
  formData.append('img', imgDataUrl)

  fetch('//ca-upload.com/here/upload.php', {
    method: 'POST',
    body: formData,
  })
    .then((res) => res.text())
    .then((url) => {
      console.log('Got back live url:', url)
      onSuccess(url)
    })
    .catch((err) => {
      console.error(err)
    })
}
