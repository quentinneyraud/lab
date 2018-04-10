import Page from '../Page'
import debug from 'debug'

const dbg = debug('app:CurvePage')

export default class CurvePage extends Page {
  constructor () {
    super()
    dbg('Init CurvePage')
    this.depPromise = null
  }

  onEnter () {
    super.onEnter()
    this.depPromise = Promise.all([import('./Curve')])
  }

  onEnterCompleted () {
    this.depPromise.then((d) => {
      let Curve = d[0].default
      this.curve = new Curve()
      this.curve.start()
    })
  }

  onLeave () {
    super.onLeave()
    this.curve.stop()
  }
}
