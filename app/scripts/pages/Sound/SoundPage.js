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
      this.audioElement.addEventListener('ended', () => {
        this.playNextTrack()
      })

      this.currentTrackIndex = 0
      this.playCurrentTrack()
    })
  }

  onLeave () {
    super.onLeave()
    this.sound.stop()
    this.audioElement.pause()
  }

  playNextTrack () {
    this.currentTrackIndex++
    this.playCurrentTrack()
  }

  playCurrentTrack () {
    this.audioElement.src = Object.values(sounds)[this.currentTrackIndex % Object.values(sounds).length]
  }
}
