import Page from '../Page'
import debug from 'debug'

const dbg = debug('app:ImageRGBEffectPage')

export default class ImageRGBEffectPage extends Page {
  constructor () {
    super()
    dbg('Init ImageRGBEffectPage')
    this.depPromise = null
  }

  onEnter () {
    super.onEnter()
    this.depPromise = Promise.all([import('./ImageRGBEffect')])
  }

  onEnterCompleted () {
    this.depPromise.then((d) => {
      let ImageRGBEffect = d[0].default
      let images = Array.prototype.slice.call(document.getElementsByTagName('img'), 0 )
      images.forEach(img => new ImageRGBEffect(img))
    })
  }

  onLeave () {
    super.onLeave()
    this.curve.stop()
  }
}
