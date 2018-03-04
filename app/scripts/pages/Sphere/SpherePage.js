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
    this.sphere.camera.aspect = window.innerWidth / window.innerHeight
    this.sphere.camera.updateProjectionMatrix()
    this.sphere.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  loop () {
    this.sphere.update()
    this.sphere.render()

    this.rafId = requestAnimationFrame(this.loop.bind(this))
  }
}
