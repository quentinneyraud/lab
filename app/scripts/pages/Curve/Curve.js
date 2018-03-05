import { randomInt, selectClass } from '../../utils/index'
import Canvas from '../../Canvas'
import Raf from 'raf'

Raf.polyfill()

const NUMBER_OF_LINES = 4
const NUMBER_OF_POINTS = 25

export default class Curve {
  constructor () {
    this.canvas = new Canvas()
    this.canvas.addTo(selectClass('page-content'))

    this.lines = new Array(NUMBER_OF_LINES).fill(null)
    this.colors = ['#00BCD4', '#FF9800', '#FF5722', '#2196F3']

    this.definePoints()
    this.animePoints()

    window.addEventListener('resize', this.onResize.bind(this))
  }

  start () {
    this.loop()
  }

  stop () {
    Raf.cancel(this.rafId)
  }

  loop () {
    this.render()
    this.rafId = Raf(this.loop.bind(this))
  }

  definePoints () {
    let points = []
    for (let i = 0; i <= window.innerWidth; i += window.innerWidth / NUMBER_OF_POINTS) {
      points.push({
        x: i,
        y: window.innerHeight / 2
      })
    }
    this.lines = this.lines.map(() => JSON.parse(JSON.stringify(points)))
  }

  animePoints () {
    setInterval(() => {
      this.lines.forEach((line) => {
        line.forEach((point, index) => {
          if (index < 3 || index > line.length - 4) return
          TweenMax.to(point, 1, {
            y: window.innerHeight / 2 + randomInt(-100, 100),
            ease: SlowMo.ease.config(0.3, 0.3, false)
          })
        })
      })
    }, 1000)
  }

  onResize () {
    this.lines.forEach((line) => {
      line.forEach((point, pointIndex) => {
        if (pointIndex < 3 || pointIndex > line.length - 4) {
          TweenMax.to(point, 1, {y: window.innerHeight / 2, ease: Power3.easeInOut})
        }
      })
    })
  }

  render () {
    // Clear
    this.canvas.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.canvas.context.fillStyle = '#2D2D2D'
    this.canvas.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Draw each lines
    this.lines.forEach((line, index) => {
      this.canvas.context.beginPath()
      this.canvas.context.moveTo(line[0].x, line[0].y)

      // Draw each points
      let i
      for (i = 1; i < line.length - 2; i++) {
        let xc = (line[i].x + line[i + 1].x) / 2
        let yc = (line[i].y + line[i + 1].y) / 2
        this.canvas.context.quadraticCurveTo(line[i].x, line[i].y, xc, yc)
      }

      this.canvas.context.quadraticCurveTo(line[i].x, line[i].y, line[i + 1].x, line[i + 1].y)

      this.canvas.context.strokeStyle = this.colors[index]
      this.canvas.context.stroke()
    })
  }
}
