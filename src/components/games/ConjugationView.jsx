import React, { useState } from 'react'
import ProgressBar from '../ProgressBar.jsx'
import SessionSummary from '../SessionSummary.jsx'
import { useGameSession } from '../../hooks/useGameSession.js'
import { pronouns, pronounLabels } from '../../data/verbs.js'

export default function ConjugationView({ game, onMenu }) {
  const { current, index, total, feedback, score, submit, next, summary, isDone } = useGameSession(game, 'conjugation')
  const [selected, setSelected] = useState(null)
  const [tableInputs, setTableInputs] = useState({})

  if (isDone) return <SessionSummary summary={summary} gameType="conjugation" onReplay={onMenu} onMenu={onMenu} />

  const handleNext = () => {
    setSelected(null)
    setTableInputs({})
    next()
  }

  // --- pick-form / pick-verb mode ---
  if (current.mode !== 'full-table') {
    const handleSelect = (option) => {
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
          <div style={styles.prompt}>{current.prompt}</div>
        </div>
        <div style={styles.optGrid}>
          {current.options.map(o => (
            <button key={o} style={getOptStyle(o)} onClick={() => handleSelect(o)}>{o}</button>
          ))}
        </div>
        {feedback && (
          <div style={styles.feedbackRow}>
            <span style={{ color: feedback.correct ? 'green' : 'red', fontWeight: 600 }}>
              {feedback.correct ? 'Correct!' : `It's "${feedback.correctAnswer}"`}
            </span>
            <button style={styles.nextBtn} onClick={handleNext}>Next →</button>
          </div>
        )}
      </div>
    )
  }

  // --- full-table mode ---
  const handleTableSubmit = () => {
    if (feedback) return
    submit(tableInputs)
  }

  return (
    <div style={styles.container}>
      <ProgressBar current={index} total={total} score={score} />
      <div style={styles.card}>
        <div style={styles.prompt}>{current.prompt}</div>
      </div>

      <div style={styles.table}>
        {pronouns.map(p => (
          <div key={p} style={styles.tableRow}>
            <label style={styles.tableLabel}>{pronounLabels[p]}</label>
            <input
              style={{
                ...styles.tableInput,
                borderColor: feedback
                  ? (feedback.results?.[p] ? '#28a745' : '#dc3545')
                  : '#ccc',
              }}
              value={tableInputs[p] ?? ''}
              onChange={e => setTableInputs(prev => ({ ...prev, [p]: e.target.value }))}
              disabled={!!feedback}
              placeholder="conjugation..."
            />
            {feedback && !feedback.results?.[p] && (
              <span style={styles.correctHint}> → {current.correctTable[p]}</span>
            )}
          </div>
        ))}
      </div>

      {!feedback && (
        <button style={styles.submitBtn} onClick={handleTableSubmit}>Check</button>
      )}
      {feedback && (
        <div style={styles.feedbackRow}>
          <span style={{ color: feedback.correct ? 'green' : 'red', fontWeight: 600 }}>
            {feedback.correct ? 'All correct!' : 'Some errors — see above'}
          </span>
          <button style={styles.nextBtn} onClick={handleNext}>Next →</button>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { padding: 24, maxWidth: 520, margin: '0 auto' },
  card: { background: '#fff', borderRadius: 10, padding: 24, textAlign: 'center', marginBottom: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.08)' },
  prompt: { fontSize: 20, fontWeight: 700 },
  optGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 },
  option: { padding: '14px', borderRadius: 8, border: '2px solid #ddd', background: '#fff', fontSize: 16, cursor: 'pointer' },
  table: { background: '#fff', borderRadius: 10, padding: 16, marginBottom: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.08)' },
  tableRow: { display: 'flex', alignItems: 'center', marginBottom: 10 },
  tableLabel: { width: 180, fontSize: 14, color: '#555' },
  tableInput: { flex: 1, padding: '6px 10px', borderRadius: 6, border: '2px solid #ccc', fontSize: 15 },
  correctHint: { marginLeft: 8, color: 'green', fontSize: 13, fontWeight: 600 },
  submitBtn: { width: '100%', padding: 12, background: '#4a90e2', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer' },
  feedbackRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  nextBtn: { padding: '8px 20px', borderRadius: 6, background: '#4a90e2', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 15 },
}
