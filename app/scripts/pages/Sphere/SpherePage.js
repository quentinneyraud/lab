import Page from '../Page'
import debug from 'debug'

const dbg = debug('app:SpherePage')

export default class SpherePage extends Page {
  constructor () {
    super()
    dbg('Init SpherePage')
  }

  onEnter () {
    super.onEnter()
    this.depPromise = Promise.all([import('three'), import('./Sphere')])
  }

  onEnterCompleted () {
    this.depPromise.then((res) => {
      // TODO: remove setTimeout() and keep a clean animation homepage->sphere
      window.setTimeout(() => {
        this.sphere = new res[1].default(res[0])
        this.sphere.start()
      }, 0)
    })
  }

  onLeave () {
    super.onLeave()
    this.sphere.stop()
  }
}
