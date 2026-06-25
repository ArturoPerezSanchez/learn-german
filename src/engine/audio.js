/**
 * Audio manager — thin wrapper around the Web Audio API / HTMLAudioElement.
 *
 * SFX files live in /audio/sfx/ (served from assets/ via publicDir).
 * Music loops live in /audio/music/.
 *
 * Design-token defaults (sfxVolume: 0.45, musicVolume: 0.18) are respected.
 * A single `isMuted` flag lets the user silence everything.
 *
 * Usage:
 *   audio.play('correct')          → plays correct_soft.wav
 *   audio.play('flip')             → plays card_flip.wav
 *   audio.startMusic('focus')      → starts focus_loop.wav looping
 *   audio.stopMusic()
 *   audio.setMuted(true)
 */

const SFX_MAP = {
  correct:      '/audio/sfx/correct_soft.wav',
  incorrect:    '/audio/sfx/incorrect_gentle.wav',
  flip:         '/audio/sfx/card_flip.wav',
  tap:          '/audio/sfx/tap_soft.wav',
  streak:       '/audio/sfx/streak_sparkle.wav',
  levelComplete:'/audio/sfx/level_complete.wav',
  pronunciation:'/audio/sfx/pronunciation_ping.wav',
}

const MUSIC_MAP = {
  focus:      '/audio/music/focus_loop.wav',
  welcome:    '/audio/music/warm_welcome_loop.wav',
  celebration:'/audio/music/celebration_loop.wav',
}

const SFX_VOLUME   = 0.45
const MUSIC_VOLUME = 0.18

// Cache HTMLAudioElement instances for SFX to avoid repeated fetches
const sfxCache = {}

let musicEl = null
let muted = false

function getSfx(key) {
  if (!sfxCache[key]) {
    sfxCache[key] = new Audio(SFX_MAP[key])
    sfxCache[key].volume = SFX_VOLUME
  }
  return sfxCache[key]
}

export const audio = {
  /**
   * Play a sound effect by name.
   * Calling play() while the same sound is playing restarts it.
   */
  play(key) {
    if (muted || !SFX_MAP[key]) return
    try {
      const el = getSfx(key)
      el.currentTime = 0
      el.play().catch(() => {})  // autoplay policy — silently ignore
    } catch {}
  },

  /** Start a looping music track. Stops the current one if running. */
  startMusic(key) {
    if (!MUSIC_MAP[key]) return
    try {
      if (musicEl) {
        musicEl.pause()
        musicEl.currentTime = 0
      }
      musicEl = new Audio(MUSIC_MAP[key])
      musicEl.loop = true
      musicEl.volume = muted ? 0 : MUSIC_VOLUME
      musicEl.play().catch(() => {})
    } catch {}
  },

  stopMusic() {
    if (musicEl) {
      musicEl.pause()
      musicEl.currentTime = 0
    }
  },

  setMuted(val) {
    muted = val
    if (musicEl) musicEl.volume = val ? 0 : MUSIC_VOLUME
  },

  isMuted() {
    return muted
  },
}
