/**
 * Sentence Builder Game
 *
 * Shows shuffled word tiles; player drags/clicks them into correct order.
 * This is pure logic — the UI layer handles actual drag/click interaction.
 *
 * createSentenceBuilderGame({ exercises }) →
 *   { questions, check(question, orderedWords) → { correct, correctSentence, wrongIndexes } }
 */

import { shuffle } from '../engine/utils.js'

export function createSentenceBuilderGame({ exercises }) {
  const questions = shuffle(exercises).map(ex => ({
    id: `sb-${ex.id}`,
    type: 'sentence-builder',
    // Shuffled tiles the player arranges
    tiles: shuffle([...ex.correct]),
    // The ground truth
    correct: ex.correct,
    translation: ex.translation,
    level: ex.level,
  }))

  return {
    questions,

    /**
     * @param {object} question
     * @param {string[]} orderedWords  — the player's arrangement
     * @returns {{ correct: boolean, correctSentence: string, wrongIndexes: number[] }}
     */
    check(question, orderedWords) {
      const correct = question.correct
      const wrongIndexes = []
      let allCorrect = orderedWords.length === correct.length

      for (let i = 0; i < Math.max(orderedWords.length, correct.length); i++) {
        if (orderedWords[i] !== correct[i]) {
          wrongIndexes.push(i)
          allCorrect = false
        }
      }

      return {
        correct: allCorrect,
        correctSentence: correct.join(' '),
        wrongIndexes,
      }
    },
  }
}
