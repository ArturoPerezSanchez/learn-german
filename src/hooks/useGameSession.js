import { useState, useCallback, useMemo } from 'react'
import { createSession } from '../engine/session.js'
import { recordSession } from '../engine/progress.js'
import { audio } from '../engine/audio.js'

export function useGameSession(game, gameType) {
  const session = useMemo(() => createSession(game.questions), [game])

  // current is held in state so it only advances when next() is called,
  // not immediately when session.answer() increments the internal index.
  const [current, setCurrent] = useState(() => session.current())
  const [index, setIndex]         = useState(0)
  const [feedback, setFeedback]   = useState(null)
  const [score, setScore]         = useState(0)
  const [streak, setStreak]       = useState(0)
  const [done, setDone]           = useState(false)
  const [summaryData, setSummaryData] = useState(null)

  const submit = useCallback((answer) => {
    if (done || feedback) return
    // Capture the question BEFORE session.answer() increments its index
    const question   = current
    const checkResult   = game.check(question, answer)
    const sessionResult = session.answer(checkResult.correct, answer)

    if (sessionResult.streak >= 5) audio.play('streak')
    else if (checkResult.correct)  audio.play('correct')
    else                           audio.play('incorrect')

    setFeedback({ ...checkResult, ...sessionResult })
    setScore(sessionResult.score)
    setStreak(sessionResult.streak)
  }, [done, feedback, current, game, session])

  const next = useCallback(() => {
    setFeedback(null)
    if (!session.hasNext()) {
      const s = session.summary()
      setSummaryData(s)
      recordSession(s, gameType)
      audio.play('levelComplete')
      setDone(true)
    } else {
      // Advance current only now — after the user dismisses feedback
      setCurrent(session.current())
      setIndex(i => i + 1)
    }
  }, [session, gameType])

  return {
    current,
    index,
    total:   session.total,
    feedback,
    score,
    streak,
    submit,
    next,
    summary: summaryData,
    isDone:  done,
  }
}
