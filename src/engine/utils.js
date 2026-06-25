/** Fisher-Yates shuffle — returns a new shuffled array */
export function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Pick n unique random items from an array */
export function pickRandom(array, n) {
  return shuffle(array).slice(0, n)
}

/** Pick one item different from `exclude` */
export function pickOther(array, exclude) {
  const pool = array.filter(x => x !== exclude)
  return pool[Math.floor(Math.random() * pool.length)]
}

/** Clamp a number between min and max */
export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}
