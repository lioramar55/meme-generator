var gTrans = {
  title: {
    en: "Lior's Book Shop!",
    he: 'חנות הספרים של ליאור',
  },
  gallery: {
    en: 'gallery',
    he: 'גלריה',
  },
  memes: {
    en: 'memes',
    he: 'הממים שלך',
  },
  about: {
    en: 'about',
    he: 'אודות',
  },
  'editor-header': {
    en: 'Choose a template',
    he: 'בחר תבנית',
  },
  flexible: {
    en: 'flexible',
    he: 'אני גמיש',
  },
  tags: {
    en: 'Popular tags',
    he: 'תגיות פופולריות',
  },
  more: {
    en: 'Show More',
    he: 'ראה עוד',
  },
  download: {
    en: 'Download',
    he: 'הורד',
  },
  upload: {
    en: 'Upload',
    he: 'העלה',
  },
  share: {
    en: 'Share',
    he: 'שתף',
  },
  'about-header': {
    en: 'Hey, my name is Lior Amar',
    he: 'שלום, קוראים לי ליאור עמר',
  },
  'about-sub-header': {
    en: 'Full-stack Developer',
    he: 'מפתח פול-סטאק',
  },
  'memes-error': {
    en: "You don't have any saved memes",
    he: 'אין לך ממים שמורים',
  },
  footer: {
    en: 'Meme-Generator by Lior R Amar 2022',
    he: 'מחולל ממים, פותח על ידי ליאור עמר 2022',
  },
}

var gCurrLang = 'en'

function getTrans(transKey) {
  var keyTrans = gTrans[transKey]
  if (!keyTrans) return 'UNKNOWN'

  var txt = keyTrans[gCurrLang]
  if (!txt) txt = keyTrans.en

  return txt
}

function getCurrLang() {
  return gCurrLang
}

function doTrans() {
  var els = document.querySelectorAll('[data-trans]')
  els.forEach((el) => {
    var transKey = el.dataset.trans
    var txt = getTrans(transKey)
    if (el.nodeName !== 'INPUT') el.innerText = txt
  })
}

function setLang(lang) {
  gCurrLang = lang
}

function formatNumOlder(num) {
  return num.toLocaleString('es')
}

function formatNum(num) {
  return new Intl.NumberFormat(gCurrLang).format(num)
}

function formatCurrency(num, locale, curr) {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: curr }).format(num)
}

function formatDate(time) {
  var options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }

  return new Intl.DateTimeFormat(gCurrLang, options).format(time)
}

function kmToMiles(km) {
  return km / 1.609
}
