import React, { useState } from 'react'
import ProgressBar from '../ProgressBar.jsx'
import SessionSummary from '../SessionSummary.jsx'
import { useGameSession } from '../../hooks/useGameSession.js'

export default function FillBlankView({ game, onMenu }) {
  const { current, index, total, feedback, score, submit, next, summary, isDone } = useGameSession(game, 'fill-blank')
  const [typed, setTyped] = useState('')
  const [selected, setSelected] = useState(null)

  if (isDone) return <SessionSummary summary={summary} gameType="fill-blank" onReplay={onMenu} onMenu={onMenu} />

  const handleNext = () => {
    setTyped('')
    setSelected(null)
    next()
  }

  // Format sentence with highlighted blank
  const parts = current.sentence.split('___')
  const displaySentence = (answer) =>
    parts.length === 2
      ? <>{parts[0]}<span style={{ borderBottom: '2px solid #4a90e2', minWidth: 60, display: 'inline-block', textAlign: 'center' }}>{answer ?? ''}</span>{parts[1]}</>
      : current.sentence

  // Pick mode
  if (current.inputMode === 'pick') {
    const handlePick = (option) => {
      if (feedback) return
      setSelected(option)
      submit(option)
    }

    const getOptStyle = (option) => {
      if (!feedback) return styles.option
      if (option === feedback.correctAnswer) return { ...styles.option, background: '#d4edda', borderColor: '#28a745' }
      if (option === selected && !feedback.correct) return { ...styles.option, background: '#f8d7da', borderColor: '#dc3545' }
      return { ...styles.option, opacity: 0.5 }
    }

    return (
      <div style={styles.container}>
        <ProgressBar current={index} total={total} score={score} />
        <div style={styles.card}>
          <div style={styles.sentence}>{displaySentence(selected)}</div>
          <div style={styles.translation}>{current.translation}</div>
        </div>
        <div style={styles.optGrid}>
          {current.options.map(o => (
            <button key={o} style={getOptStyle(o)} onClick={() => handlePick(o)}>{o}</button>
          ))}
        </div>
        {feedback && (
          <div style={styles.feedbackRow}>
            <span style={{ color: feedback.correct ? 'green' : 'red', fontWeight: 600 }}>
              {feedback.correct ? 'Correct!' : `It's "${feedback.correctAnswer}"`}
              {!feedback.correct && current.hint && ` — ${current.hint}`}
            </span>
            <button style={styles.nextBtn} onClick={handleNext}>Next →</button>
          </div>
        )}
      </div>
    )
  }

  // Type mode
  const handleSubmit = () => {
    if (feedback || !typed.trim()) return
    submit(typed.trim())
  }

  return (
    <div style={styles.container}>
      <ProgressBar current={index} total={total} score={score} />
      <div style={styles.card}>
        <div style={styles.sentence}>{displaySentence(typed || null)}</div>
        <div style={styles.translation}>{current.translation}</div>
        {current.hint && <div style={styles.hint}>Hint: {current.hint}</div>}
      </div>
      <div style={styles.inputRow}>
        <input
          style={styles.textInput}
          value={typed}
          onChange={e => setTyped(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          disabled={!!feedback}
          placeholder="Type your answer..."
          autoFocus
        />
        <button style={styles.submitBtn} onClick={handleSubmit} disabled={!!feedback}>Check</button>
      </div>
      {feedback && (
        <div style={styles.feedbackRow}>
          <span style={{ color: feedback.correct ? 'green' : 'red', fontWeight: 600 }}>
            {feedback.correct ? 'Correct!' : `Correct: "${feedback.correctAnswer}"`}
          </span>
          <button style={styles.nextBtn} onClick={handleNext}>Next →</button>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { padding: 24, maxWidth: 520, margin: '0 auto' },
  card: { background: '#fff', borderRadius: 10, padding: 28, textAlign: 'center', marginBottom: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.08)' },
  sentence: { fontSize: 22, fontWeight: 500, marginBottom: 10 },
  translation: { fontSize: 15, color: '#777' },
  hint: { fontSize: 13, color: '#aaa', marginTop: 8 },
  optGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 },
  option: { padding: '12px', borderRadius: 8, border: '2px solid #ddd', background: '#fff', fontSize: 16, cursor: 'pointer' },
  inputRow: { display: 'flex', gap: 10, marginBottom: 16 },
  textInput: { flex: 1, padding: '10px 14px', borderRadius: 8, border: '2px solid #ddd', fontSize: 16 },
  submitBtn: { padding: '10px 20px', borderRadius: 8, background: '#4a90e2', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 16 },
  feedbackRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  nextBtn: { padding: '8px 20px', borderRadius: 6, background: '#4a90e2', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 15 },
}
