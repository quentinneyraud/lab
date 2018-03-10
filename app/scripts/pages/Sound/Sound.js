import Raf from 'raf'
import Canvas from '../../Canvas'
import { selectClass } from '../../utils/index'
import Circle from './Circle'

Raf.polyfill()

export default class Sound {
  constructor (audioElement) {
    // Create audio & Canvas
    this.audioElement = audioElement
    this.canvas = new Canvas()
    this.canvas.addTo(selectClass('page-content'))

    this.createAudioAnalysis()
    this.defineCircles()
    this.circleOptions = Object.keys(this.circles)
    this.currentCircleOptionIndex = 0
    window.addEventListener('resize', this.defineCircles.bind(this))
    window.addEventListener('click', () => this.currentCircleOptionIndex++)
  }

  defineCircles () {
    this.circles = {
      cursor: [
        new Circle(this.canvas.context, {
          x: this.canvas.width / 2,
          y: this.canvas.height / 2,
          circleStrokeWidth: 60,
          soundInfluenceOnRadiusCoeff: 2.5,
          pointsLength: 100,
          followMouse: true
        })
      ],
      multiple: [
        new Circle(this.canvas.context, {
          x: this.canvas.width / 4,
          y: this.canvas.height / 4,
          circleStrokeWidth: 20,
          soundInfluenceOnRadiusCoeff: 0.5,
          pointsLength: 10
        }),
        new Circle(this.canvas.context, {
          x: this.canvas.width / 4,
          y: this.canvas.height / 4 * 3,
          circleStrokeWidth: 80,
          soundInfluenceOnRadiusCoeff: 1,
          pointsLength: 35
        }),
        new Circle(this.canvas.context, {
          x: this.canvas.width / 4 * 3,
          y: this.canvas.height / 4,
          circleStrokeWidth: 20,
          soundInfluenceOnRadiusCoeff: 0.5,
          pointsLength: 10
        }),
        new Circle(this.canvas.context, {
          x: this.canvas.width / 4 * 3,
          y: this.canvas.height / 4 * 3,
          circleStrokeWidth: 80,
          soundInfluenceOnRadiusCoeff: 1,
          pointsLength: 35
        })
      ],
      corners: [
        new Circle(this.canvas.context, {
          x: 0,
          y: 0,
          circleStrokeWidth: 80,
          soundInfluenceOnRadiusCoeff: 2.5,
          pointsLength: 40
        }),
        new Circle(this.canvas.context, {
          x: this.canvas.width,
          y: 0,
          circleStrokeWidth: 80,
          soundInfluenceOnRadiusCoeff: 2.5,
          pointsLength: 40
        }),
        new Circle(this.canvas.context, {
          x: this.canvas.width,
          y: this.canvas.height,
          circleStrokeWidth: 80,
          soundInfluenceOnRadiusCoeff: 2.5,
          pointsLength: 40
        }),
        new Circle(this.canvas.context, {
          x: 0,
          y: this.canvas.height,
          circleStrokeWidth: 80,
          soundInfluenceOnRadiusCoeff: 2.5,
          pointsLength: 40
        })
      ]
    }
  }

  createAudioAnalysis () {
    this.context = new window.AudioContext()
    this.analyser = this.context.createAnalyser()
    this.analyser.fftSize = 64
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount)
    let source = this.context.createMediaElementSource(this.audioElement)
    source.connect(this.analyser)
    this.analyser.connect(this.context.destination)
  }

  start () {
    this.render()
  }

  stop () {
    Raf.cancel(this.rafId)
  }

  render () {
    this.canvas.clear()

    if (this.analyser) {
      this.analyser.getByteFrequencyData(this.frequencyData)
      let average = (this.frequencyData.reduce((p, c) => p + c) / this.frequencyData.length)

      const circleKey = this.circleOptions[this.currentCircleOptionIndex % this.circleOptions.length]
      this.circles[circleKey].forEach(circle => circle.render(average))
    }

    this.rafId = Raf(this.render.bind(this))
  }
}
