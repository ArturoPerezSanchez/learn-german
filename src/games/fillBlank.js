/**
 * Fill-in-the-Blank Game
 *
 * Shows a sentence with a gap; player types or picks the correct word.
 *
 * Two input modes:
 *   'type'  — free text input (strict or lenient matching)
 *   'pick'  — 4 choices shown (one correct + 3 distractors from same topic)
 *
 * createFillBlankGame({ exercises, inputMode, topic }) →
 *   { questions, check(question, answer) → { correct, correctAnswer } }
 */

import { shuffle, pickRandom } from '../engine/utils.js'

export function createFillBlankGame({ exercises, inputMode = 'pick', topic = null }) {
  const pool = topic ? exercises.filter(e => e.topic === topic) : exercises
  const selected = shuffle(pool)

  const questions = selected.map(ex => {
    const q = {
      id: `fb-${ex.id}`,
      type: 'fill-blank',
      inputMode,
      sentence: ex.sentence,
      hint: ex.hint,
      translation: ex.translation,
      topic: ex.topic,
      level: ex.level,
      correctAnswer: ex.answer,
    }

    if (inputMode === 'pick') {
      // Build distractors from other exercises' answers (same topic preferred)
      const sameTopic = pool.filter(e => e.id !== ex.id && e.topic === ex.topic)
      const anyOther = pool.filter(e => e.id !== ex.id)
      const distPool = sameTopic.length >= 3 ? sameTopic : anyOther
      const distractors = [...new Set(distPool.map(e => e.answer))].filter(a => a !== ex.answer)
      const wrongOptions = pickRandom(distractors, 3)
      q.options = shuffle([ex.answer, ...wrongOptions])
    }

    return q
  })

  return {
    questions,

    /**
     * @param {object} question
     * @param {string} answer
     * @returns {{ correct: boolean, correctAnswer: string }}
     */
    check(question, answer) {
      const normalize = s => s.trim().toLowerCase()
      const correct = normalize(answer) === normalize(question.correctAnswer)
      return { correct, correctAnswer: question.correctAnswer }
    },
  }
}
