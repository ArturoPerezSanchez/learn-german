/**
 * useMatchingGame — manages selection state for the matching board.
 */

import { useState, useCallback } from 'react'
import { recordSession } from '../engine/progress.js'

export function useMatchingGame(matchingGame) {
  const { pairs } = matchingGame
  const [selectedGerman, setSelectedGerman] = useState(null)
  const [selectedEnglish, setSelectedEnglish] = useState(null)
  const [matched, setMatched] = useState(new Set())
  const [lastResult, setLastResult] = useState(null)
  const [mistakes, setMistakes] = useState(0)
  const [startTime] = useState(Date.now())
  const [done, setDone] = useState(false)

  // Attempt to match the currently selected german + english card
  const attempt = useCallback((germanId, englishId, currentMatched) => {
    const { correct } = matchingGame.checkPair(germanId, englishId)

    if (correct) {
      const newMatched = new Set([...currentMatched, germanId])
      setMatched(newMatched)
      setLastResult({ correct: true, id: germanId })
      setSelectedGerman(null)
      setSelectedEnglish(null)

      if (matchingGame.isComplete(newMatched)) {
        const m = mistakes + (correct ? 0 : 1)
        recordSession({
          score: pairs.length,
          total: pairs.length,
          percent: 100,
          maxStreak: pairs.length,
          durationMs: Date.now() - startTime,
          results: [],
        }, 'matching')
        setDone(true)
      }
    } else {
      setMistakes(m => m + 1)
      setLastResult({ correct: false, germanId, englishId })
      setSelectedGerman(null)
      setSelectedEnglish(null)
    }
  }, [matchingGame, pairs.length, startTime, mistakes])

  const selectGerman = useCallback((id, currentEnglish) => {
    const newGerman = id
    if (currentEnglish) {
      attempt(newGerman, currentEnglish, matched)
    } else {
      setSelectedGerman(prev => prev === id ? null : id)
    }
  }, [attempt, matched])

  const selectEnglish = useCallback((id, currentGerman) => {
    const newEnglish = id
    if (currentGerman) {
      attempt(currentGerman, newEnglish, matched)
    } else {
      setSelectedEnglish(prev => prev === id ? null : id)
    }
  }, [attempt, matched])

  return {
    pairs,
    matched,
    selectedGerman,
    selectedEnglish,
    lastResult,
    mistakes,
    done,
    selectGerman,
    selectEnglish,
  }
}
