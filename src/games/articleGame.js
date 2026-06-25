import { shuffle } from '../engine/utils.js'

const ACCUSATIVE_MAP = { der: 'den', die: 'die', das: 'das' }

/**
 * Article Game (Der / Die / Das)
 * nouns: normalised card objects with article field
 */
export function createArticleGame({ nouns, includeAccusative = false }) {
  const questions = shuffle(nouns).map(noun => {
    const useAccusative = includeAccusative && Math.random() > 0.5
    const correctArticle = useAccusative ? ACCUSATIVE_MAP[noun.article] : noun.article
    const options = useAccusative ? ['den', 'die', 'das'] : ['der', 'die', 'das']

    return {
      id:             `article-${noun.id}`,
      type:           'article',
      de:             noun.de,
      en:             noun.en,
      case:           useAccusative ? 'accusative' : 'nominative',
      prompt:         useAccusative ? `Ich sehe ___ ${noun.de}.` : `___ ${noun.de}`,
      options,
      correctAnswer:  correctArticle,
      imageUrl:       noun.imageUrl   ?? null,
      visualCue:      noun.visualCue  ?? null,
    }
  })

  return {
    questions,
    check(question, chosen) {
      return { correct: chosen === question.correctAnswer, correctAnswer: question.correctAnswer }
    },
  }
}
