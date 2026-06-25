import { shuffle } from '../engine/utils.js'
import { reviewCard } from '../engine/spacedRepetition.js'

/**
 * Flashcard Game
 * items: normalised card objects (from expandedVocabulary.js or vocabulary.js)
 * mode: 'de→en' | 'en→de'
 */
export function createFlashcardGame({ items, mode = 'de→en', cardRecords = {} }) {
  const questions = shuffle(items).map(item => ({
    id: item.id,
    type: 'flashcard',
    front: mode === 'de→en' ? buildGermanLabel(item) : item.en,
    back:  mode === 'de→en' ? item.en : buildGermanLabel(item),
    imageUrl:   item.imageUrl   ?? null,
    visualCue:  item.visualCue  ?? null,
    de: item.de,
    en: item.en,
    item,
  }))

  return {
    questions,
    check(question, rating) {
      const existing = cardRecords[question.id] ?? {
        id: question.id, easeFactor: 2.5, interval: 0, repetitions: 0, nextReview: Date.now(),
      }
      const updatedRecord = reviewCard(existing, rating)
      return { correct: rating >= 3, rating, updatedRecord }
    },
  }
}

function buildGermanLabel(item) {
  if (item.article) return `${item.article} ${item.de}`
  return item.de
}
