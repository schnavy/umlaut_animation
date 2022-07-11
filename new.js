// ------ CONFIG ------

const FRAME_DELAY = 0 // höhere Zahl = niederigere Frame Rate
const SCROLL_ANIMATION_SPEED = 7 // höhere Zahl = schneller
const INTRO_SPEED = 20 // in ms - Zeit zwischen Frames -> niedrigere Zahl = schneller
const START_DELAY = 1000 // in ms - Delay bevor das Into beginnt

// ------ SETUP ------

const INTRO_COUNT = 35
const FRAME_COUNT = 29

const INTRO_FILE_PREFIX = 'public/Intro_web_m/Echo-Umlaut_INTRO_m_'
const INTRO_FILE_PREFIX_MOBILE = 'public/Intro_web_s/Echo-Umlaut_INTRO_s_'

const FILE_PREFIX = 'public/scroll_web_m/Echo-Umlaut_m_'
const FILE_PREFIX_MOBILE = 'public/scroll_web_s/Echo-Umlaut_s_'

//  INIT
const IS_TOUCH = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0
let IS_MOBILE = window.innerWidth <= 1000
let counter = 0
let size = updateSize()
let frame_counter = 0
let intro_over = false

window.addEventListener('resize', e => (size = updateSize()), true)

//  PRELOADER

let intro_images = []
let images = []

for (let i = 0; i < INTRO_COUNT; i++) {
  intro_images[i] = new Image()
  intro_images[i].src = INTRO_FILE_PREFIX_MOBILE + pad(i) + '.jpg'
}
for (let i = 1; i < FRAME_COUNT; i++) {
  images[i] = new Image()
  images[i].src = FILE_PREFIX_MOBILE + pad(i) + '.jpg'
}

// PAINT CANVAS

const html = document.documentElement
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
let img = new Image();
canvas.width = window.innerWidth
canvas.height = window.innerHeight

// INTRO

setTimeout(() => {
  (function intro (i) {
    setTimeout(function () {
      context.drawImage(
        intro_images[i],
        canvas.width / 2 - size / 2,
        canvas.height / 2 - size / 2,
        size,
        size
      )
      ++i < INTRO_COUNT ? intro(i) : activate_scroll()
    }, INTRO_SPEED)
  })(0)
}, START_DELAY)

//  SCROLL ANIMATION

function activate_scroll () {
  if (IS_TOUCH) {
    document.addEventListener('scroll', event => {
      const scrollTop = html.scrollTop
      const tmp = scrollTop * 0.1

      counter = Math.floor(tmp % FRAME_COUNT)
      requestAnimationFrame(() => updateImage(counter))
    })
  } else {
    document.addEventListener('wheel', event => {
      if (frame_counter++ % FRAME_DELAY != 0) {
        if (checkScrollDirectionIsUp(event)) {
          counter -= Math.floor(1 + SCROLL_ANIMATION_SPEED / 10)
          if (counter < 0) {
            counter = FRAME_COUNT - 1
          }
        } else {
          counter += Math.floor(1 + SCROLL_ANIMATION_SPEED / 10)
          if (counter >= FRAME_COUNT) {
            counter = 0
          }
        }
        requestAnimationFrame(() => updateImage(counter))
      }
    })
  }
}

//  HELFER

function pad (num) {
  var s = '000000000' + num
  return s.substring(s.length - 5, s.length)
}

function currentFrame (num) {
  // console.log(pad(num % FRAME_COUNT))
  if (IS_TOUCH) {
    num = num % FRAME_COUNT
  }
  if (IS_MOBILE) {
    return FILE_PREFIX_MOBILE + pad(num) + '.jpg'
  } else {
    return FILE_PREFIX + pad(num) + '.jpg'
  }
}

const updateImage = index => {
  img.src = currentFrame(index)
  context.drawImage(
    img,
    canvas.width / 2 - size / 2,
    canvas.height / 2 - size / 2,
    size,
    size
  )
}

function updateSize () {
  if (IS_MOBILE) {
    return Math.max(window.innerWidth, window.innerHeight + 200)
  } else {
    return Math.max(window.innerWidth, window.innerHeight)
  }
}

function checkScrollDirectionIsUp (event) {
  if (event.wheelDelta) {
    return event.wheelDelta > 0
  }
  return event.deltaY < 0
}
