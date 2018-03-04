import Page from './Page'
import debug from 'debug'
import { selectClass } from '../utils/index'

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
        yPercent: 100
      })
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
      yPercent: 0,
      ease: Power2.easeOut
    })
  }

  onMouseLeave (e) {
    const technos = e.target.querySelectorAll('p')
    TweenMax.to(technos, 0.2, {
      yPercent: 100
    }, 0.05)
  }
}
