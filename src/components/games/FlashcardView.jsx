import React, { useState, useEffect } from 'react'
import ProgressBar from '../ProgressBar.jsx'
import SessionSummary from '../SessionSummary.jsx'
import CardImage from '../CardImage.jsx'
import { useGameSession } from '../../hooks/useGameSession.js'
import { audio } from '../../engine/audio.js'

const RATING_BUTTONS = [
  { label: 'Again', r: 1, color: 'var(--color-error)' },
  { label: 'Hard',  r: 2, color: 'var(--color-warning)' },
  { label: 'Good',  r: 4, color: 'var(--color-leaf)' },
  { label: 'Easy',  r: 5, color: 'var(--color-spruce)' },
]

export default function FlashcardView({ game, onMenu }) {
  const { current, index, total, score, submit, next, summary, isDone } = useGameSession(game, 'flashcard')
  const [flipped, setFlipped] = useState(false)

  // Reset flip state when the question advances
  useEffect(() => { setFlipped(false) }, [index])

  if (isDone) return <SessionSummary summary={summary} gameType="flashcard" onReplay={onMenu} onMenu={onMenu} />

  const handleFlip = () => {
    audio.play('flip')
    setFlipped(true)
  }

  const handleRate = (rating) => {
    submit(rating)
    next()
  }

  return (
    <div style={s.container}>
      <ProgressBar current={index} total={total} score={score} />

      <div style={s.cardWrap} onClick={!flipped ? handleFlip : undefined}>
        {!flipped ? (
          // Front: illustration + German word/label
          <div style={s.frontFace}>
            <CardImage
              imageUrl={current.imageUrl}
              visualCue={current.visualCue}
              de={current.front}
              en={current.back}
              mode="no-english"
              width={260}
            />
            <div style={s.tapHint}>tap to reveal</div>
          </div>
        ) : (
          // Back: full card (German + English both visible)
          <div style={s.backFace}>
            <CardImage
              imageUrl={current.imageUrl}
              visualCue={current.visualCue}
              de={current.de}
              en={current.en}
              mode="full"
              width={260}
            />
          </div>
        )}
      </div>

      {flipped && (
        <div style={s.ratingSection}>
          <div style={s.ratingLabel}>How well did you know it?</div>
          <div style={s.ratingRow}>
            {RATING_BUTTONS.map(({ label, r, color }) => (
              <button key={r} style={{ ...s.rateBtn, borderColor: color, color }} onClick={() => handleRate(r)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const s = {
  container:     { padding: 'var(--space-lg)', maxWidth: 400, margin: '0 auto' },
  cardWrap:      { display: 'flex', justifyContent: 'center', marginBottom: 20, cursor: 'pointer' },
  frontFace:     { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 },
  backFace:      { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  tapHint:       { fontSize: 13, color: 'var(--color-spruce)', opacity: 0.7 },
  ratingSection: { textAlign: 'center' },
  ratingLabel:   { fontSize: 14, color: 'var(--color-ink)', opacity: 0.6, marginBottom: 10 },
  ratingRow:     { display: 'flex', gap: 10, justifyContent: 'center' },
  rateBtn: {
    padding: '9px 18px', borderRadius: 'var(--radius-md)',
    border: '2px solid', background: 'var(--color-paper)',
    fontSize: 15, fontWeight: 700, cursor: 'pointer',
    transition: 'opacity var(--motion-fast)',
  },
}
