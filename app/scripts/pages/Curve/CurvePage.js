import Page from '../Page'
import debug from 'debug'

const dbg = debug('app:CurvePage')

export default class CurvePage extends Page {
  constructor () {
    super()
    dbg('Init CurvePage')
  }

  onEnter () {
    super.onEnter()
    import('./Curve').then((Curve) => {
      this.curve = new Curve.default()
      this.rafId = null
      this.loop()
    })
  }

  onLeave () {
    super.onLeave()
    window.cancelAnimationFrame(this.rafId)
  }

  initializeEvents () {
    super.initializeEvents()
    window.addEventListener('resize', this.onResize.bind(this))
  }

  onResize () {
    this.curve.setCanvasSize()
  }

  loop () {
    this.curve.draw()

    this.rafId = requestAnimationFrame(this.loop.bind(this))
  }
}
