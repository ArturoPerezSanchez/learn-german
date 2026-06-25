/**
 * SM-2 spaced repetition algorithm.
 *
 * Card record shape:
 * {
 *   id: string,
 *   easeFactor: number,   // ≥ 1.3, starts at 2.5
 *   interval: number,     // days until next review
 *   repetitions: number,  // consecutive correct answers
 *   nextReview: number,   // timestamp (ms) of next due date
 * }
 *
 * Rating (0–5):
 *   0 = complete blackout
 *   1 = incorrect, easy to recall after
 *   2 = incorrect but remembered on prompt
 *   3 = correct with difficulty
 *   4 = correct after hesitation
 *   5 = perfect recall
 */

const DEFAULT_EASE = 2.5
const MIN_EASE = 1.3

/** Create a fresh card record for a given item id */
export function createCardRecord(id) {
  return {
    id,
    easeFactor: DEFAULT_EASE,
    interval: 0,
    repetitions: 0,
    nextReview: Date.now(),
  }
}

/**
 * Update a card record based on the user's rating.
 * Returns an updated card record (does not mutate).
 */
export function reviewCard(card, rating) {
  const r = Math.round(clamp(rating, 0, 5))
  let { easeFactor, interval, repetitions } = card

  if (r < 3) {
    // Failed — restart repetition count but keep ease factor
    repetitions = 0
    interval = 1
  } else {
    if (repetitions === 0) interval = 1
    else if (repetitions === 1) interval = 6
    else interval = Math.round(interval * easeFactor)
    repetitions += 1
  }

  // Update ease factor
  easeFactor = easeFactor + (0.1 - (5 - r) * (0.08 + (5 - r) * 0.02))
  if (easeFactor < MIN_EASE) easeFactor = MIN_EASE

  const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000

  return { ...card, easeFactor, interval, repetitions, nextReview }
}

/** Returns true if a card is due for review now */
export function isDue(card) {
  return Date.now() >= card.nextReview
}

/** Given a map of card records, return only the due ones sorted by urgency */
export function getDueCards(cardMap) {
  return Object.values(cardMap)
    .filter(isDue)
    .sort((a, b) => a.nextReview - b.nextReview)
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}
