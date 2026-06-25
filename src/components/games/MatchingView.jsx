import React from 'react'
import { useMatchingGame } from '../../hooks/useMatchingGame.js'

export default function MatchingView({ game, onMenu }) {
  const {
    pairs, matched, selectedGerman, selectedEnglish,
    lastResult, mistakes, done,
    selectGerman, selectEnglish,
  } = useMatchingGame(game)

  if (done) {
    return (
      <div style={s.container}>
        <h2 style={{ marginBottom: 12 }}>Board Clear! 🎉</h2>
        <p>Mistakes: <strong>{mistakes}</strong></p>
        <p style={{ marginBottom: 20 }}>Score: <strong>{Math.max(0, pairs.length - mistakes)} / {pairs.length}</strong></p>
        <button style={s.menuBtn} onClick={onMenu}>Main Menu</button>
      </div>
    )
  }

  const cardStyle = (id, isGerman) => {
    const isMatched  = matched.has(id)
    const isSelected = isGerman ? selectedGerman === id : selectedEnglish === id
    const wasWrong   = lastResult && !lastResult.correct &&
      (isGerman ? lastResult.germanId === id : lastResult.englishId === id)
    return {
      ...s.card,
      visibility:   isMatched ? 'hidden' : 'visible',
      pointerEvents: isMatched ? 'none' : 'auto',
      background:   isSelected ? 'var(--color-spruce)'
                  : wasWrong   ? '#fde8e8'
                  : 'var(--color-paper)',
      color:        isSelected ? '#fff' : 'var(--color-ink)',
      borderColor:  isSelected ? 'var(--color-spruce)'
                  : wasWrong   ? 'var(--color-error)'
                  : 'var(--color-line)',
    }
  }

  return (
    <div style={s.container}>
      <div style={s.header}>
        <span>Match all pairs</span>
        <span style={{ color: mistakes > 0 ? 'var(--color-error)' : 'var(--color-success)' }}>
          {mistakes > 0 ? `${mistakes} mistake${mistakes > 1 ? 's' : ''}` : `${matched.size} / ${pairs.length}`}
        </span>
      </div>

      <div style={s.board}>
        {/* German column — mini card images */}
        <div style={s.col}>
          {pairs.map(p => (
            <button
              key={p.id}
              style={cardStyle(p.id, true)}
              onClick={() => selectGerman(p.id, selectedEnglish)}
            >
              {p.visualCue
                ? <span style={s.cardEmoji}>{p.visualCue}</span>
                : null
              }
              <span style={s.cardLabel}>{p.german}</span>
            </button>
          ))}
        </div>

        {/* English column — plain text */}
        <div style={s.col}>
          {pairs.map(p => (
            <button
              key={p.id}
              style={cardStyle(p.id, false)}
              onClick={() => selectEnglish(p.id, selectedGerman)}
            >
              <span style={s.cardLabel}>{p.english}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const s = {
  container: { padding: 'var(--space-lg)', maxWidth: 560, margin: '0 auto' },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16, fontSize: 15, fontWeight: 700,
  },
  board:   { display: 'flex', gap: 12 },
  col:     { flex: 1, display: 'flex', flexDirection: 'column', gap: 10 },
  card: {
    padding: '10px 12px', borderRadius: 'var(--radius-md)',
    border: '2px solid', background: 'var(--color-paper)',
    cursor: 'pointer', transition: 'all var(--motion-fast)',
    display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left',
  },
  cardEmoji: { fontSize: 22, flexShrink: 0 },
  cardLabel: { fontSize: 14, fontWeight: 600 },
  menuBtn: {
    padding: '10px 24px', borderRadius: 'var(--radius-md)',
    background: 'var(--color-spruce)', color: '#fff',
    border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 700,
  },
}
