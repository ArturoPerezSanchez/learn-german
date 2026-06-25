import { shuffle, pickRandom } from '../engine/utils.js'

/**
 * Multiple Choice Game
 * items: normalised card objects
 * mode: 'de→en' | 'en→de'
 */
export function createMultipleChoiceGame({ items, mode = 'de→en', optionCount = 4 }) {
  const questions = shuffle(items).map(item => {
    const questionText  = mode === 'de→en' ? getGerman(item) : item.en
    const correctAnswer = mode === 'de→en' ? item.en : getGerman(item)
    const distractors   = pickRandom(
      items.filter(x => x.id !== item.id).map(x => mode === 'de→en' ? x.en : getGerman(x)),
      optionCount - 1,
    )
    return {
      id:            `mc-${item.id}`,
      type:          'multiple-choice',
      question:      questionText,
      options:       shuffle([correctAnswer, ...distractors]),
      correctAnswer,
      imageUrl:      item.imageUrl  ?? null,
      visualCue:     item.visualCue ?? null,
      de:            item.de,
      en:            item.en,
    }
  })

  return {
    questions,
    check(question, chosen) {
      return { correct: chosen === question.correctAnswer, correctAnswer: question.correctAnswer }
    },
  }
}

function getGerman(item) {
  return item.article ? `${item.article} ${item.de}` : item.de
}
