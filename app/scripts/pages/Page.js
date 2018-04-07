import Barba from 'barba.js'

export default class Page {
  constructor () {
    this.active = false
    this.intervals = []
    this.timeouts = []
    this.$els = {}
  }

  initializeBarba (namespace, getPageByNamespace) {
    Barba.BaseView.extend({
      namespace: namespace,
      onEnter: this.onEnter.bind(this),
      onEnterCompleted: this.onEnterCompleted.bind(this),
      onLeave: this.onLeave.bind(this),
      onLeaveCompleted: this.onLeaveCompleted.bind(this)
    }).init()
    this.getPageByNamespace = getPageByNamespace
  }

  onEnter () {
    this.active = true
    this.initializeElements()
    this.initializeEvents()
  }

  onEnterCompleted () {
  }

  onLeave () {
    this.active = false
  }

  onLeaveCompleted () {
    this.clearIntervals()
    this.clearTimeouts()
  }

  /**
   * Return
   * @param options contains el (<a> element) and data attributes
   */
  getTransition (options) {
    let _ = this

    if (options.datas.transition === 'to-project') {
      return {
        start: function () {
          document.body.classList.add('loading')

          this.newContainerLoading
            .then(() => {
              return new Promise((resolve) => {
                new TimelineMax({onComplete: resolve})
                  .to('.project-item', 0.3, {
                    scale: 0.8,
                    autoAlpha: 0.8,
                    ease: Power3.easeInOut
                  })
              })
            })
            .then(() => {
              new TimelineMax()
                .call(() => {
                  this.newContainer.style.visibility = 'visible'
                })
                .to([this.newContainer, this.oldContainer], 1, {
                  y: -window.innerHeight,
                  ease: Power3.easeIn
                })
                .call(this.done.bind(this))
                .set(this.newContainer, {
                  y: 0
                })
                .call(() => {
                  document.body.classList.remove('loading')
                })
              // remettre cursor normal
            })
        }
      }
    }

    return {
      start: function () {
        Promise.all([new Promise((resolve) => {
          new TimelineMax({onComplete: resolve})
            .to('.overflow-transition', 0.5, {width: window.innerWidth})
            .set('.overflow-transition', {left: 0})
        }), this.newContainerLoading])
          .then(() => {
            return _.getPageByNamespace(this.newContainer.dataset['namespace']).depPromise || Promise.resolve()
          })
          .then(() => {
            new TimelineMax()
              .call(this.done.bind(this))
              .to('.overflow-transition', 0.5, {width: 0}, '+=0.5')
              .set('.overflow-transition', {right: 0, left: 'auto'})
          })
      }
    }
  }

  /**
   * Fill $els with body and window elements
   * called on enter
   */
  initializeElements () {
    this.$els = {
      window,
      body: document.body
    }
  }

  /**
   * Initialize all events
   * called on enter, after initializeElements()
   */
  initializeEvents () {
  }

  /**
   * Add interval and timeout ids, they will be cleared on leave
   */

  addInterval (intervalId) {
    this.intervals.push(intervalId)
  }

  clearIntervals () {
    this.intervals.forEach((intervalId) => {
      clearInterval(intervalId)
    })
  }

  addTimeout (timeoutId) {
    this.timeouts.push(timeoutId)
  }

  clearTimeouts () {
    this.timeouts.forEach((timeoutId) => {
      clearTimeout(timeoutId)
    })
  }
}
