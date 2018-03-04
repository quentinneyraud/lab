import { randomInt } from '../../utils/index'

export default class Curve {
  constructor () {
    this.lines = []
    this.colors = ['#00BCD4', '#FF9800', '#FF5722', '#2196F3']
    this.initializeElements()
    this.setCanvasSize()
    this.definePoints()
    this.animePoints()
  }

  initializeElements () {
    this.$els = {
      canvas: document.getElementById('canvas')
    }

    this.context = this.$els.canvas.getContext('2d')
  }

  definePoints () {
    let points = []
    for (let i = 0; i <= window.innerWidth; i += window.innerWidth / 25) {
      points.push({
        x: i,
        y: window.innerHeight / 2
      })
    }
    this.addLines(points, 4)
  }

  addLines (line, occurence = 1) {
    for (let i = 0; i < occurence; i++) {
      this.lines.push(JSON.parse(JSON.stringify(line)))
    }
  }

  animePoints () {
    setInterval(() => {
      this.lines.forEach((line) => {
        line.forEach((point, index) => {
          if (index < 3 || index > line.length - 4) return
          TweenMax.to(point, 1, {y: window.innerHeight / 2 + randomInt(-100, 100), ease: SlowMo.ease.config(0.3, 0.3, false)})
        })
      })
    }, 1000)
  }

  setCanvasSize () {
    this.$els.canvas.width = window.innerWidth
    this.$els.canvas.height = window.innerHeight

    this.lines.forEach((line, index) => {
      line.forEach((point, index) => {
        if (index < 3 || index > line.length - 4) {
          TweenMax.to(point, 1, {y: window.innerHeight / 2, ease: Power3.easeInOut})
        }
      })
    })
  }

  draw () {
    this.context.clearRect(0, 0, this.$els.canvas.width, this.$els.canvas.height)

    this.context.fillStyle = '#2D2D2D'
    this.context.fillRect(0, 0, this.$els.canvas.width, this.$els.canvas.height)

    this.lines.forEach((line, index) => {
      this.context.beginPath()
      this.context.moveTo(line[0].x, line[0].y)

      for (var i = 1; i < line.length - 2; i++) {
        var xc = (line[i].x + line[i + 1].x) / 2
        var yc = (line[i].y + line[i + 1].y) / 2
        this.context.quadraticCurveTo(line[i].x, line[i].y, xc, yc)
      }

      this.context.quadraticCurveTo(line[i].x, line[i].y, line[i + 1].x, line[i + 1].y)

      this.context.strokeStyle = this.colors[index]
      this.context.stroke()
    })
  }
}
