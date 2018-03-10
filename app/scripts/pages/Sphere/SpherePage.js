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
    const dependencies = [import('three'), import('./Sphere')]
    Promise.all(dependencies).then((res) => {
      this.sphere = new res[1].default(res[0])
      this.sphere.start()
    })
  }

  onLeave () {
    super.onLeave()
    this.sphere.stop()
  }
}
