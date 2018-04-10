import Raf from 'raf'

Raf.polyfill()

const MAXIMUM_MOVE_X = 10
const MAXIMUM_MOVE_Y = 5

export default class ImageRGBEffect {
  constructor (image) {
    this.image = image
    this.imageDatas = null
    this.channels = {}
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')

    if (this.image.complete) {
      this.onImageLoad()
    } else {
      this.image.onload = this.onImageLoad.bind(this)
    }

    this.canvas.addEventListener('mouseenter', this.onMouseEnter.bind(this))
    this.canvas.addEventListener('mouseleave', this.onMouseLeave.bind(this))
  }

  onMouseEnter () {
    this.render()
    TweenMax.to(this.channels['red'], 0.6, {
      x: MAXIMUM_MOVE_X,
      // y: -MAXIMUM_MOVE_Y,
      ease: Power2.easeInOut
    })
    TweenMax.to(this.channels['blue'], 0.6, {
      x: -MAXIMUM_MOVE_X,
      // y: MAXIMUM_MOVE_Y,
      ease: Power2.easeInOut
    })
  }

  onMouseLeave () {
    TweenMax.to([this.channels['red'], this.channels['blue']], 0.5, {
      x: 0,
      y: 0,
      onComplete: this.stopRendering.bind(this)
    })
  }

  setCanvasSize () {
    this.canvas.width = this.image.width
    this.canvas.height = this.image.height
  }

  createChannel (type) {
    let imagaDataChannel = this.context.createImageData(this.imageDatas.width, this.imageDatas.height)
    for (let i = 0; i < this.imageDatas.data.length; i += 4) {
      imagaDataChannel.data[i] = (type === 'red') ? this.imageDatas.data[i] : 0
      imagaDataChannel.data[i + 1] = (type === 'green') ? this.imageDatas.data[i + 1] : 0
      imagaDataChannel.data[i + 2] = (type === 'blue') ? this.imageDatas.data[i + 2] : 0
      imagaDataChannel.data[i + 3] = this.imageDatas.data[i + 3]
    }
    return imagaDataChannel
  }

  createChannels () {
    this.channels = {
      red: {
        imageData: this.createChannel('red'),
        x: 0,
        y: 0
      },
      green: {
        imageData: this.createChannel('green'),
        x: 0,
        y: 0
      },
      blue: {
        imageData: this.createChannel('blue'),
        x: 0,
        y: 0
      }
    }
  }

  onImageLoad () {
    this.setCanvasSize()
    this.context.drawImage(this.image, 0, 0)
    this.imageDatas = this.context.getImageData(0, 0, this.image.width, this.image.height)
    this.createChannels()

    this.image.parentNode.appendChild(this.canvas)
    this.image.parentNode.removeChild(this.image)

    this.render()
  }

  render () {
    this.context.globalCompositeOperation = 'screen'
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    Object.keys(this.channels).forEach((key) => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.width = this.image.width
      canvas.height = this.image.height
      context.putImageData(this.channels[key].imageData, 0, 0)
      this.context.drawImage(canvas, this.channels[key].x, this.channels[key].y)
    })

    this.rafId = Raf(this.render.bind(this))
  }

  stopRendering () {
    Raf.cancel(this.rafId)
  }
}
