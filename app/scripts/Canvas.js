const OPTIONS = {
  fullPage: true,
  width: 400,
  height: 300
}

export default class Canvas {
  constructor (options) {
    this.options = {
      ...OPTIONS,
      ...options
    }
    this.createCanvas()
  }

  createCanvas () {
    this.domElement = document.createElement('canvas')
    this.context = this.domElement.getContext('2d')
    this.setSize()
    this.initializeEvents()
  }

  addTo (htmlElement) {
    htmlElement.appendChild(this.domElement)
  }

  initializeEvents () {
    window.addEventListener('resize', this.setSize.bind(this))
  }

  setSize () {
    this.width = this.domElement.width = (this.options.fullPage) ? window.innerWidth : this.options.width
    this.height = this.domElement.height = (this.options.fullPage) ? window.innerHeight : this.options.height
  }

  clear (clearColor = '#2D2D2D') {
    this.context.clearRect(0, 0, this.width, this.height)
    this.context.fillStyle = clearColor
    this.context.fillRect(0, 0, this.width, this.height)
  }
}
