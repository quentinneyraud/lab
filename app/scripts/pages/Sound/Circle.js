import { randomInt } from '../../utils/index'

export default class Circle {
  constructor (canvasContext, options) {
    this.canvasContext = canvasContext
    this.x = options.x
    this.y = options.y
    this.circleStrokeWidth = options.circleStrokeWidth
    this.soundInfluenceOnRadiusCoeff = options.soundInfluenceOnRadiusCoeff
    this.pointsLength = options.pointsLength
  }

  render (averageSound) {
    for (let i = 0; i < this.pointsLength; i++) {
      let angle = Math.random() * Math.PI * 2
      let radius = randomInt(averageSound * this.soundInfluenceOnRadiusCoeff - this.circleStrokeWidth / 2, averageSound * this.soundInfluenceOnRadiusCoeff + this.circleStrokeWidth / 2)
      let x = Math.cos(angle) * radius
      let y = Math.sin(angle) * radius

      this.drawPoint(
        this.x + x,
        this.y + y,
        randomInt(1, 10)
      )
    }
  }

  drawPoint (x, y, radius) {
    this.canvasContext.beginPath()
    this.canvasContext.arc(x, y, radius, 0, 2 * Math.PI, false)
    this.canvasContext.closePath()

    this.canvasContext.fillStyle = this.getRandomColor()
    this.canvasContext.fill()
  }

  getRandomColor () {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }
}
