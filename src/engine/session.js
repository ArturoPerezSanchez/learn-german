/**
 * GameSession manages the state for a single game run:
 * question queue, score, streak, and timing.
 *
 * Usage:
 *   const session = createSession(questions)
 *   session.current()        → current question
 *   session.answer(isCorrect) → advances queue, returns result
 *   session.summary()        → final stats
 */

export function createSession(questions) {
  const queue = [...questions]
  let index = 0
  let score = 0
  let streak = 0
  let maxStreak = 0
  let startTime = Date.now()
  let results = []

  return {
    /** Total number of questions in this session */
    total: queue.length,

    /** The current question object */
    current() {
      return queue[index] ?? null
    },

    /** Index of the current question (0-based) */
    currentIndex() {
      return index
    },

    /** Whether the session has more questions */
    hasNext() {
      return index < queue.length
    },

    /**
     * Record the user's answer.
     * @param {boolean} isCorrect
     * @param {*} givenAnswer - what the user selected/typed
     * @returns {{ correct: boolean, streak: number, score: number }}
     */
    answer(isCorrect, givenAnswer = null) {
      const question = queue[index]
      if (isCorrect) {
        score++
        streak++
        if (streak > maxStreak) maxStreak = streak
      } else {
        streak = 0
      }
      results.push({ question, isCorrect, givenAnswer })
      index++
      return { correct: isCorrect, streak, score }
    },

    /** Current score */
    getScore() {
      return score
    },

    /** Current streak */
    getStreak() {
      return streak
    },

    /**
     * Session summary — call when hasNext() is false.
     * @returns {{ score, total, percent, maxStreak, durationMs, results }}
     */
    summary() {
      return {
        score,
        total: queue.length,
        percent: queue.length > 0 ? Math.round((score / queue.length) * 100) : 0,
        maxStreak,
        durationMs: Date.now() - startTime,
        results,
      }
    },
  }
}
