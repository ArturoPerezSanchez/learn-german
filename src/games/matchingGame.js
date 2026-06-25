import { shuffle } from '../engine/utils.js'

/**
 * Matching Game — two columns, German ↔ English.
 * items: normalised card objects
 */
export function createMatchingGame({ items, pairCount = 6 }) {
  const selected = shuffle(items).slice(0, pairCount)

  const pairs = selected.map(item => ({
    id:       item.id,
    german:   item.article ? `${item.article} ${item.de}` : item.de,
    english:  item.en,
    imageUrl: item.imageUrl  ?? null,
    visualCue:item.visualCue ?? null,
  }))

  return {
    pairs,
    checkPair(germanId, englishId) {
      return { correct: germanId === englishId }
    },
    isComplete(matchedIds) {
      return pairs.every(p => matchedIds.has(p.id))
    },
  }
}
