import React from 'react'

export default function ProgressBar({ current, total, score }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0
  return (
    <div style={styles.wrapper}>
      <div style={styles.track}>
        <div style={{ ...styles.fill, width: `${pct}%` }} />
      </div>
      <div style={styles.label}>{current}/{total} · Score: {score}</div>
    </div>
  )
}

const styles = {
  wrapper: { marginBottom: 16 },
  track: { height: 8, background: '#ddd', borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', background: '#4a90e2', transition: 'width 0.3s' },
  label: { fontSize: 13, color: '#666', marginTop: 4 },
}
