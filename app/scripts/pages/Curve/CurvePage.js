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
      this.curve.start()
    })
  }

  onLeave () {
    super.onLeave()
    this.curve.stop()
  }
}
