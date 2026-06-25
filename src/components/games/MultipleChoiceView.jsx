import React, { useState, useEffect } from 'react'
import ProgressBar from '../ProgressBar.jsx'
import SessionSummary from '../SessionSummary.jsx'
import CardImage from '../CardImage.jsx'
import { useGameSession } from '../../hooks/useGameSession.js'

export default function MultipleChoiceView({ game, gameType = 'multiple-choice', onMenu }) {
  const { current, index, total, feedback, score, streak, submit, next, summary, isDone } = useGameSession(game, gameType)
  const [selected, setSelected] = useState(null)

  useEffect(() => { setSelected(null) }, [index])

  if (isDone) return <SessionSummary summary={summary} gameType={gameType} onReplay={onMenu} onMenu={onMenu} />

  const handleSelect = (option) => {
    if (feedback) return
    setSelected(option)
    submit(option)
  }

  const handleNext = () => next()

  const getOptStyle = (option) => {
    if (!feedback) return s.option
    if (option === feedback.correctAnswer) return { ...s.option, background: '#d4edda', borderColor: 'var(--color-success)', fontWeight: 700 }
    if (option === selected && !feedback.correct) return { ...s.option, background: '#fde8e8', borderColor: 'var(--color-error)' }
    return { ...s.option, opacity: 0.4 }
  }

  return (
    <div style={s.container}>
      <ProgressBar current={index} total={total} score={score} />
      {streak > 1 && <div style={s.streak}>🔥 {streak}</div>}

      <div style={s.questionBox}>
        {/* Before answer: show illustration + question text */}
        {/* After answer: show the full card as reveal */}
        {feedback ? (
          <div style={s.cardReveal}>
            <CardImage
              imageUrl={current.imageUrl}
              visualCue={current.visualCue}
              de={current.de}
              en={current.en}
              mode="full"
              width={180}
            />
          </div>
        ) : (
          <div style={s.questionFront}>
            {current.visualCue
              ? <div style={s.cue}>{current.visualCue}</div>
              : <CardImage imageUrl={current.imageUrl} visualCue={current.visualCue} de={current.de} en={current.en} mode="illustration" width={160} />
            }
            <div style={s.questionText}>{current.question}</div>
          </div>
        )}
      </div>

      <div style={s.optionGrid}>
        {current.options.map(option => (
          <button key={option} style={getOptStyle(option)} onClick={() => handleSelect(option)}>
            {option}
          </button>
        ))}
      </div>

      {feedback && (
        <div style={s.feedbackRow}>
          <span style={{ color: feedback.correct ? 'var(--color-success)' : 'var(--color-error)', fontWeight: 700 }}>
            {feedback.correct ? 'Richtig! ✓' : `→ ${feedback.correctAnswer}`}
          </span>
          <button style={s.nextBtn} onClick={handleNext}>Next →</button>
        </div>
      )}
    </div>
  )
}

const s = {
  container:    { padding: 'var(--space-lg)', maxWidth: 480, margin: '0 auto' },
  streak:       { color: 'var(--color-warning)', fontWeight: 700, marginBottom: 8 },
  questionBox: {
    background: 'var(--color-paper)', borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-lg)', textAlign: 'center', marginBottom: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)', minHeight: 160,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  questionFront: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 },
  cardReveal:    { display: 'flex', justifyContent: 'center' },
  cue:           { fontSize: 72 },
  questionText:  { fontSize: 26, fontWeight: 800, color: 'var(--color-ink)' },
  optionGrid:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 },
  option: {
    padding: '14px 10px', borderRadius: 'var(--radius-md)',
    border: '2px solid var(--color-line)', background: 'var(--color-paper)',
    fontSize: 15, fontWeight: 600, cursor: 'pointer',
    transition: 'all var(--motion-fast)',
  },
  feedbackRow:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  nextBtn: {
    padding: '8px 22px', borderRadius: 'var(--radius-md)',
    background: 'var(--color-spruce)', color: '#fff',
    border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 700,
  },
}
