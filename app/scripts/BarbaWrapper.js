import Barba from 'barba.js'

const DEFAULT_OPTIONS = {
  cache: false,
  prefetch: false,
  navId: null,
  refreshOnSameHrefClick: false
}

export default class BarbaWrapper {
  /**
   * Merge options
   *
   * @param options See available options in DEFAULT_OPTIONS
   * @returns {BarbaWrapper}
   */
  constructor (options) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options)
    this.pages = {}
    this.navLinks = (this.options.navId) ? Array.from(document.getElementById(this.options.navId).getElementsByTagName('a')) : null
    return this
  }

  /**
   * Create a Barba view
   *
   * @param namespace that is set in front matter
   * @param page instance which extends Page
   * @returns {BarbaWrapper}
   */
  match (namespace, page) {
    page.initializeBarba(namespace, this.getPageByNamespace.bind(this))
    this.pages[namespace] = page
    return this
  }

  getPageByNamespace (ns) {
    return this.pages[ns]
  }

  /**
   * Call it after all match()
   */
  start () {
    Barba.Pjax.cacheEnabled = this.options.cache
    Barba.Pjax.start()
    if (this.options.prefetch) Barba.Prefetch.init()

    // Transitions
    Barba.Dispatcher.on('linkClicked', this.onBarbaLinkClicked.bind(this))

    // Refresh
    if (!this.options.refreshOnSameHrefClick) {
      Array.from(document.querySelectorAll('a[href]')).forEach((link) => {
        link.addEventListener('click', this.onLinkClicked.bind(this))
      })
    }

    // Update links
    if (this.navLinks && this.navLinks.length) {
      this.onBarbaNewPageReady()
      Barba.Dispatcher.on('newPageReady', this.onBarbaNewPageReady.bind(this))
    }
  }

  onLinkClicked (event) {
    if (event.currentTarget.href === window.location.href) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  /**
   * Define transition on link click, getting it from active page instance or use default
   *
   * @param el element clicked
   */
  onBarbaLinkClicked (el) {
    const transition = this.getActivePage().getTransition({
      el,
      datas: Object.assign({}, el.dataset)
    }) || this.getDefaultTransition()

    Barba.Pjax.getTransition = () => {
      return Barba.BaseTransition.extend(transition)
    }
  }

  /**
   * Return current page
   *
   * @returns {*}
   */
  getActivePage () {
    for (let index in this.pages) {
      if (this.pages.hasOwnProperty(index) && this.pages[index].active) {
        return this.pages[index]
      }
    }
  }

  /**
   * Return a fade transition
   *
   * @returns {{start: start, finish: finish}}
   */
  getDefaultTransition () {
    // Note : Do not use arrow function to keep Barba.BaseTransition context
    return {
      start: function () {
        this.newContainerLoading
          .then(this.finish.bind(this))
      },
      finish: function () {
        this.done()
      }
    }
  }

  /**
   * Add active class on all links matching current url
   */
  onBarbaNewPageReady () {
    const sanitizePathname = pathname => pathname.split('/').filter(w => w).join('/')
    const currentPathname = sanitizePathname(window.location.pathname)

    this.navLinks.forEach((link) => {
      if (sanitizePathname(link.getAttribute('href')) === currentPathname) {
        link.classList.add('active')
      } else {
        link.classList.remove('active')
      }
    })
  }
}
