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
  }

  addTo (htmlElement) {
    htmlElement.appendChild(this.domElement)

    this.setSize()
    this.initializeEvents()
  }

  initializeEvents () {
    window.addEventListener('resize', this.setSize.bind(this))
  }

  setSize () {
    this.width = this.domElement.width = (this.options.fullPage) ? window.innerWidth : this.options.width
    this.height = this.domElement.height = (this.options.fullPage) ? window.innerHeight : this.options.height
  }
}
