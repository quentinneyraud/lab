import Page from './Page'
import debug from 'debug'
import { selectClass } from '../utils/index'
// import Loader from '../Loader'
import projectsGifs from '../../img/*.gif'

const dbg = debug('app:HomePage')

export default class HomePage extends Page {
  constructor () {
    super()
    dbg('Init HomePage')
  }

  onEnter () {
    super.onEnter()

    this.$els.projectItems.forEach((projectItem) => {
      const p = projectItem.querySelectorAll('p')
      TweenMax.set(p, {
        y: p[0].offsetHeight
      })

      let image = new Image()
      TweenMax.set(image, {
        autoAlpha: 0
      })

      image.onload = () => {
        projectItem.getElementsByTagName('figure')[0].appendChild(image)
        TweenMax.to(image, 0.5, {
          autoAlpha: 1
        })
      }

      image.src = projectsGifs[projectItem.id]
    })
  }

  initializeElements () {
    super.initializeElements()

    Object.assign(this.$els, {
      projectItems: selectClass('project-item', true)
    })
  }

  initializeEvents () {
    super.initializeEvents()

    this.$els.projectItems.forEach((projectItem) => {
      projectItem.addEventListener('mouseenter', this.onMouseEnter.bind(this))
      projectItem.addEventListener('mouseleave', this.onMouseLeave.bind(this))
    })
  }

  onMouseEnter (e) {
    const technos = e.target.querySelectorAll('p')
    TweenMax.to(technos, 0.15, {
      y: 0,
      ease: Power2.easeOut
    })
  }

  onMouseLeave (e) {
    const technos = e.target.querySelectorAll('p')
    TweenMax.to(technos, 0.2, {
      y: technos[0].offsetHeight
    }, 0.05)
  }
}
