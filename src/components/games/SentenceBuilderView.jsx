import React, { useState, useEffect } from 'react'
import ProgressBar from '../ProgressBar.jsx'
import SessionSummary from '../SessionSummary.jsx'
import { useGameSession } from '../../hooks/useGameSession.js'

export default function SentenceBuilderView({ game, onMenu }) {
  const { current, index, total, feedback, score, submit, next, summary, isDone } = useGameSession(game, 'sentence-builder')
  const [placed, setPlaced] = useState([])
  const [remaining, setRemaining] = useState([])

  // Reset tiles whenever the question changes
  useEffect(() => {
    if (current) {
      setPlaced([])
      setRemaining([...current.tiles])
    }
  }, [index])

  if (isDone) return <SessionSummary summary={summary} gameType="sentence-builder" onReplay={onMenu} onMenu={onMenu} />

  const moveToPlaced = (tileIndex) => {
    if (feedback) return
    const word = remaining[tileIndex]
    setRemaining(prev => prev.filter((_, i) => i !== tileIndex))
    setPlaced(prev => [...prev, word])
  }

  const returnToBank = (placedIndex) => {
    if (feedback) return
    const word = placed[placedIndex]
    setPlaced(prev => prev.filter((_, i) => i !== placedIndex))
    setRemaining(prev => [...prev, word])
  }

  const handleCheck = () => {
    if (feedback || placed.length === 0) return
    submit(placed)
  }

  const handleNext = () => next()

  return (
    <div style={styles.container}>
      <ProgressBar current={index} total={total} score={score} />

      <div style={styles.card}>
        <div style={styles.translation}>{current.translation}</div>
        <div style={styles.dropZone}>
          {placed.length === 0
            ? <span style={styles.placeholder}>Click tiles to build the sentence</span>
            : placed.map((word, i) => (
              <button
                key={i}
                style={{
                  ...styles.tile,
                  ...(feedback
                    ? feedback.wrongIndexes?.includes(i) ? styles.tileWrong : styles.tileRight
                    : {}),
                }}
                onClick={() => returnToBank(i)}
              >
                {word}
              </button>
            ))
          }
        </div>
      </div>

      <div style={styles.tileBank}>
        {remaining.map((word, i) => (
          <button key={i} style={styles.tile} onClick={() => moveToPlaced(i)}>
            {word}
          </button>
        ))}
      </div>

      {!feedback && placed.length > 0 && (
        <button style={styles.checkBtn} onClick={handleCheck}>Check</button>
      )}

      {feedback && (
        <div style={styles.feedbackRow}>
          <span style={{ color: feedback.correct ? 'green' : 'red', fontWeight: 600 }}>
            {feedback.correct ? 'Perfect!' : `Correct: "${feedback.correctSentence}"`}
          </span>
          <button style={styles.nextBtn} onClick={handleNext}>Next →</button>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { padding: 24, maxWidth: 560, margin: '0 auto' },
  card: { background: '#fff', borderRadius: 10, padding: 24, marginBottom: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.08)', minHeight: 100 },
  translation: { fontSize: 16, color: '#777', marginBottom: 12, textAlign: 'center' },
  dropZone: { minHeight: 48, display: 'flex', flexWrap: 'wrap', gap: 8, padding: 8, borderRadius: 8, border: '2px dashed #ddd', background: '#fafafa', alignItems: 'center' },
  placeholder: { color: '#bbb', fontSize: 14 },
  tileBank: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  tile: { padding: '8px 14px', borderRadius: 8, border: '2px solid #4a90e2', background: '#e8f0fe', fontSize: 15, cursor: 'pointer', fontWeight: 500 },
  tileRight: { borderColor: '#28a745', background: '#d4edda' },
  tileWrong: { borderColor: '#dc3545', background: '#f8d7da' },
  checkBtn: { width: '100%', padding: 12, background: '#4a90e2', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer' },
  feedbackRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  nextBtn: { padding: '8px 20px', borderRadius: 6, background: '#4a90e2', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 15 },
}
