import React, { useState, useEffect } from 'react'
import ProgressBar from '../ProgressBar.jsx'
import SessionSummary from '../SessionSummary.jsx'
import CardImage from '../CardImage.jsx'
import { useGameSession } from '../../hooks/useGameSession.js'

const ARTICLE_COLOR = { der: '#5AA9E6', die: '#F36F5B', das: '#65A765', den: '#F9C74F' }

export default function ArticleView({ game, onMenu }) {
  const { current, index, total, feedback, score, streak, submit, next, summary, isDone } = useGameSession(game, 'article')
  const [selected, setSelected] = useState(null)

  useEffect(() => { setSelected(null) }, [index])

  if (isDone) return <SessionSummary summary={summary} gameType="article" onReplay={onMenu} onMenu={onMenu} />

  const handleSelect = (article) => {
    if (feedback) return
    setSelected(article)
    submit(article)
  }

  const handleNext = () => next()

  const getBtnStyle = (article) => {
    const base = {
      ...s.articleBtn,
      background: ARTICLE_COLOR[article] + '22',
      borderColor: ARTICLE_COLOR[article],
      color: ARTICLE_COLOR[article],
    }
    if (!feedback) return base
    if (article === feedback.correctAnswer) return { ...base, background: ARTICLE_COLOR[article], color: '#fff' }
    if (article === selected && !feedback.correct) return { ...base, background: '#ffeaea', borderColor: 'var(--color-error)' }
    return { ...base, opacity: 0.35 }
  }

  return (
    <div style={s.container}>
      <ProgressBar current={index} total={total} score={score} />
      {streak > 1 && <div style={s.streak}>🔥 {streak} streak</div>}

      <div style={s.questionArea}>
        {/* Before answer: show illustration only (hides the article badge) */}
        {/* After answer: show the full card */}
        <div style={s.cardHolder}>
          <CardImage
            imageUrl={current.imageUrl}
            visualCue={current.visualCue}
            de={current.de}
            en={current.en}
            mode={feedback ? 'full' : 'illustration'}
            width={220}
          />
        </div>

        {!feedback && (
          <div style={s.nounLabel}>
            <div style={s.caseTag}>{current.case === 'accusative' ? 'Accusative' : 'Nominative'}</div>
            <div style={s.nounText}>{current.de}</div>
            <div style={s.nounEn}>{current.en}</div>
          </div>
        )}
      </div>

      <div style={s.btnRow}>
        {current.options.map(article => (
          <button key={article} style={getBtnStyle(article)} onClick={() => handleSelect(article)}>
            {article}
          </button>
        ))}
      </div>

      {feedback && (
        <div style={s.feedbackRow}>
          <span style={{ color: feedback.correct ? 'var(--color-success)' : 'var(--color-error)', fontWeight: 700 }}>
            {feedback.correct ? 'Richtig! ✓' : `It's "${feedback.correctAnswer}"`}
          </span>
          <button style={s.nextBtn} onClick={handleNext}>Next →</button>
        </div>
      )}
    </div>
  )
}

const s = {
  container:    { padding: 'var(--space-lg)', maxWidth: 420, margin: '0 auto' },
  streak:       { color: 'var(--color-warning)', fontWeight: 700, marginBottom: 8 },
  questionArea: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginBottom: 24 },
  cardHolder:   { display: 'flex', justifyContent: 'center' },
  nounLabel:    { textAlign: 'center' },
  caseTag:      { fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--color-spruce)', marginBottom: 4 },
  nounText:     { fontSize: 30, fontWeight: 800, color: 'var(--color-ink)' },
  nounEn:       { fontSize: 15, color: 'var(--color-spruce)', marginTop: 2 },
  btnRow:       { display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 20 },
  articleBtn: {
    width: 80, height: 80, borderRadius: 'var(--radius-lg)',
    border: '3px solid', fontSize: 20, fontWeight: 800,
    cursor: 'pointer', transition: 'all var(--motion-standard)',
  },
  feedbackRow:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  nextBtn: {
    padding: '8px 22px', borderRadius: 'var(--radius-md)',
    background: 'var(--color-spruce)', color: '#fff',
    border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 700,
  },
}
