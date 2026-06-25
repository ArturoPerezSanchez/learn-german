/**
 * Progress Tracker — persists to localStorage.
 *
 * Stores:
 *   - Card records (spaced repetition state per vocabulary item)
 *   - Session history (score, percent, timestamp per game type)
 *   - Per-game stats (total played, average score, best streak)
 *
 * All reads/writes are synchronous; localStorage ops are wrapped in
 * try/catch so the app degrades gracefully in private browsing.
 */

const STORAGE_KEY = 'learn-german-progress'

const DEFAULT_STATE = {
  cardRecords: {},          // { [itemId]: CardRecord }
  sessionHistory: [],       // [SessionSummary]
  gameStats: {},            // { [gameType]: GameStats }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { ...DEFAULT_STATE }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage full or private mode — silently ignore
  }
}

/** Get the full progress state */
export function getProgress() {
  return load()
}

/** Update card records (spaced repetition) after a flashcard session */
export function updateCardRecords(updates) {
  const state = load()
  state.cardRecords = { ...state.cardRecords, ...updates }
  save(state)
}

/** Get card records for spaced repetition */
export function getCardRecords() {
  return load().cardRecords
}

/**
 * Record a completed session.
 * @param {object} summary  — from session.summary()
 * @param {string} gameType — e.g. 'flashcard', 'article', 'multiple-choice'
 */
export function recordSession(summary, gameType) {
  const state = load()

  // Append to history (keep last 100)
  const entry = {
    gameType,
    timestamp: Date.now(),
    score: summary.score,
    total: summary.total,
    percent: summary.percent,
    maxStreak: summary.maxStreak,
    durationMs: summary.durationMs,
  }
  state.sessionHistory = [entry, ...state.sessionHistory].slice(0, 100)

  // Update per-game aggregate stats
  const prev = state.gameStats[gameType] ?? { played: 0, totalScore: 0, totalQuestions: 0, bestStreak: 0 }
  state.gameStats[gameType] = {
    played: prev.played + 1,
    totalScore: prev.totalScore + summary.score,
    totalQuestions: prev.totalQuestions + summary.total,
    bestStreak: Math.max(prev.bestStreak, summary.maxStreak),
  }

  save(state)
}

/** Get aggregate stats for a specific game type */
export function getGameStats(gameType) {
  const stats = load().gameStats[gameType]
  if (!stats) return null
  return {
    ...stats,
    averagePercent: stats.totalQuestions > 0
      ? Math.round((stats.totalScore / stats.totalQuestions) * 100)
      : 0,
  }
}

/** Get recent session history, optionally filtered by game type */
export function getHistory(gameType = null, limit = 20) {
  const { sessionHistory } = load()
  const filtered = gameType ? sessionHistory.filter(s => s.gameType === gameType) : sessionHistory
  return filtered.slice(0, limit)
}

/** Wipe all progress (for a "reset" button) */
export function resetProgress() {
  save({ ...DEFAULT_STATE })
}
