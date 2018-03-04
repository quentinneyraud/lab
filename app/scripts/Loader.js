import { selectId } from './utils/index'

class Loader {
  constructor () {
    this.domElement = selectId('loader')
  }

  show () {}

  hide () {
    TweenMax.to('#loader', 0.3, {
      autoAlpha: 0
    })
  }
}

export default new Loader()
