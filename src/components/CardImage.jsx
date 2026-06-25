/**
 * CardImage — displays a vocabulary card SVG.
 *
 * The SVG card is 360×480 with this vertical layout:
 *   y≈24–66   article badge (top-left) + POS badge (top-right)
 *   y≈112–308 illustration circle (cy=210, r=98)
 *   y≈340–370 German word text
 *   y≈400–430 English translation text
 *
 * mode:
 *   'full'         — entire card (German + English visible)
 *   'no-english'   — crop to y=0–375 → hides English, shows article + word
 *   'illustration' — crop to y=85–320 → only the illustration circle
 *
 * Fallback: if no imageUrl, renders a plain text card using visualCue + de + en.
 */
import React from 'react'

const CARD_ASPECT = 480 / 360   // height / width = 1.333

const CROP = {
  full:         { topFrac: 0,    heightFrac: 1 },
  'no-english': { topFrac: 0,    heightFrac: 0.78 },  // up to ~y=375
  illustration: { topFrac: 0.18, heightFrac: 0.49 },  // y=85–320
}

export default function CardImage({ imageUrl, visualCue, de, en, mode = 'full', width = 260 }) {
  const naturalH = width * CARD_ASPECT
  const { topFrac, heightFrac } = CROP[mode] ?? CROP.full
  const containerH = naturalH * heightFrac
  const marginTop   = -(naturalH * topFrac)

  if (!imageUrl) {
    return (
      <div style={{ ...styles.fallback, width, height: containerH }}>
        {visualCue && <div style={styles.fallbackEmoji}>{visualCue}</div>}
        <div style={styles.fallbackDe}>{de}</div>
        {mode === 'full' && <div style={styles.fallbackEn}>{en}</div>}
      </div>
    )
  }

  return (
    <div style={{ width, height: containerH, overflow: 'hidden', borderRadius: 14, flexShrink: 0 }}>
      <img
        src={imageUrl}
        alt={de}
        width={width}
        height={naturalH}
        style={{ display: 'block', marginTop }}
        draggable={false}
      />
    </div>
  )
}

const styles = {
  fallback: {
    background: 'var(--color-paper)',
    border: '3px solid var(--color-ink)',
    borderRadius: 14,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  fallbackEmoji: { fontSize: 52 },
  fallbackDe:    { fontSize: 22, fontWeight: 800, color: 'var(--color-ink)' },
  fallbackEn:    { fontSize: 15, fontWeight: 600, color: 'var(--color-spruce)' },
}
