import Page from '../Page'
import debug from 'debug'
import sounds from '../../../sounds/*.mp3'
import { selectId } from '../../utils/index'

const dbg = debug('app:SoundPage')

export default class SoundPage extends Page {
  constructor () {
    super()
    dbg('Init SoundPage')

    this.currentTrackIndex = 0
  }

  onEnter () {
    super.onEnter()
    import('./Sound').then((Sound) => {
      this.audioElement = new Audio()
      this.sound = new Sound.default(this.audioElement)
      this.sound.start()

      this.audioElement.addEventListener('canplay', () => {
        this.audioElement.play()
      })

      this.currentTrackIndex = 0
      this.playCurrentTrack()
    })
  }

  initializeElements () {
    super.initializeElements()

    this.$els = {
      ...this.$els,
      prevButton: selectId('previous'),
      nextButton: selectId('next'),
      trackTitle: selectId('track-title')
    }
  }

  initializeEvents () {
    super.initializeEvents()
    this.$els.prevButton.addEventListener('click', this.onPrevButtonClick.bind(this))
    this.$els.nextButton.addEventListener('click', this.onNextButtonClick.bind(this))
  }

  onLeave () {
    super.onLeave()
    this.sound.stop()
    this.audioElement.pause()
  }

  onPrevButtonClick () {
    this.currentTrackIndex--
    this.playCurrentTrack()
  }

  onNextButtonClick () {
    this.currentTrackIndex++
    this.playCurrentTrack()
  }

  playCurrentTrack () {
    this.audioElement.src = Object.values(sounds)[this.currentTrackIndex % Object.values(sounds).length]
    this.$els.trackTitle.innerText = Object.keys(sounds)[this.currentTrackIndex % Object.values(sounds).length]
  }
}
