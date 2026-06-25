import React, { useEffect } from 'react'
import { audio } from '../engine/audio.js'
import Character from './Character.jsx'

// Stickers from assets/images/stickers/
const STICKER_BY_PERCENT = [
  { minPct: 90, src: '/images/stickers/super.svg',     alt: 'Super!' },
  { minPct: 60, src: '/images/stickers/richtig.svg',   alt: 'Richtig!' },
  { minPct: 0,  src: '/images/stickers/weiter-so.svg', alt: 'Weiter so!' },
]

function getSticker(percent) {
  return STICKER_BY_PERCENT.find(s => percent >= s.minPct)
}

// parent = good score (thumbs up), teacher = keep practising
function getCharacter(percent) {
  return percent >= 60 ? 'parent' : 'teacher'
}

export default function SessionSummary({ summary, gameType, onReplay, onMenu }) {
  const sticker   = getSticker(summary.percent)
  const character = getCharacter(summary.percent)
  const mins = Math.floor(summary.durationMs / 60000)
  const secs = Math.floor((summary.durationMs % 60000) / 1000)

  useEffect(() => {
    if (summary.percent >= 80) audio.startMusic('celebration')
    return () => audio.stopMusic()
  }, [])

  return (
    <div style={s.container}>
      {/* Character + sticker side by side */}
      <div style={s.topRow}>
        <Character id={character} size={110} />
        {sticker && <img src={sticker.src} alt={sticker.alt} style={s.sticker} />}
      </div>

      <h2 style={s.heading}>Session Complete!</h2>

      <div style={s.scoreRing}>
        <span style={s.scoreNum}>{summary.percent}%</span>
        <span style={s.scoreLabel}>{summary.score} / {summary.total} correct</span>
      </div>

      <div style={s.stats}>
        <div style={s.stat}>
          <span style={s.statVal}>{summary.maxStreak}</span>
          <span style={s.statKey}>best streak</span>
        </div>
        <div style={s.stat}>
          <span style={s.statVal}>{mins}:{String(secs).padStart(2, '0')}</span>
          <span style={s.statKey}>time</span>
        </div>
      </div>

      {summary.results.length > 0 && (
        <div style={s.breakdown}>
          {summary.results.map((r, i) => {
            const label = r.question?.noun
              ?? r.question?.question
              ?? r.question?.verb
              ?? r.question?.de
              ?? '—'
            return (
              <div key={i} style={{ ...s.row, color: r.isCorrect ? 'var(--color-success)' : 'var(--color-error)' }}>
                {r.isCorrect ? '✓' : '✗'} {label}
              </div>
            )
          })}
        </div>
      )}

      <div style={s.buttons}>
        <button style={{ ...s.btn, background: 'var(--color-mist)', color: 'var(--color-ink)' }} onClick={onMenu}>
          ← Menu
        </button>
        <button style={{ ...s.btn, background: 'var(--color-spruce)', color: '#fff' }} onClick={onReplay}>
          Play Again
        </button>
      </div>
    </div>
  )
}

const s = {
  container: {
    padding: 'var(--space-lg)', maxWidth: 420, margin: '40px auto',
    background: 'var(--color-paper)', borderRadius: 'var(--radius-lg)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)', textAlign: 'center',
  },
  topRow:   { display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 8, marginBottom: 8 },
  sticker:  { width: 100, height: 100 },
  heading:  { fontSize: 24, fontWeight: 800, marginBottom: 20, color: 'var(--color-ink)' },
  scoreRing: {
    display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
    background: 'var(--color-mist)', borderRadius: '50%',
    width: 120, height: 120, justifyContent: 'center',
    marginBottom: 20,
  },
  scoreNum:   { fontSize: 32, fontWeight: 900, color: 'var(--color-spruce)' },
  scoreLabel: { fontSize: 12, color: 'var(--color-ink)', opacity: 0.6 },
  stats:      { display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 20 },
  stat:       { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statVal:    { fontSize: 22, fontWeight: 800, color: 'var(--color-ink)' },
  statKey:    { fontSize: 12, color: 'var(--color-ink)', opacity: 0.5, textTransform: 'uppercase' },
  breakdown: {
    maxHeight: 180, overflowY: 'auto', textAlign: 'left',
    background: 'var(--color-mist)', borderRadius: 'var(--radius-md)',
    padding: '10px 14px', marginBottom: 20, fontSize: 13,
  },
  row:     { padding: '2px 0' },
  buttons: { display: 'flex', gap: 12, justifyContent: 'center' },
  btn: {
    padding: '10px 22px', borderRadius: 'var(--radius-md)',
    border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 700,
    transition: 'opacity var(--motion-fast)',
  },
}
