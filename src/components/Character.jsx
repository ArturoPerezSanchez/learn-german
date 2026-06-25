/**
 * Character — animated 4-frame sprite component.
 *
 * Follows the spec in assets/docs/character-animation-integration.md.
 * Frames crossfade at 3.6 s / loop, 3 fps.
 * Respects prefers-reduced-motion (shows frame-1 only).
 *
 * id:   'teacher' | 'child' | 'teen' | 'parent'
 * size: container width in px (height = size × 2.1 to match natural ~400×840 frames)
 */
import React from 'react'

const FOLDER = {
  teacher: 'teacher-guide',
  child:   'child-learner',
  teen:    'teen-learner',
  parent:  'parent-learner',
}

export default function Character({ id, size = 110, style = {} }) {
  const folder = FOLDER[id]
  if (!folder) return null

  const base   = `/images/characters/animations/${folder}/frames`
  const width  = size
  const height = Math.round(size * 2.1)

  return (
    <div
      className="animated-character"
      aria-hidden="true"
      style={{ width, height, position: 'relative', flexShrink: 0, ...style }}
    >
      {[1, 2, 3, 4].map(n => (
        <img
          key={n}
          src={`${base}/frame-${n}.png`}
          alt=""
          loading="eager"
          draggable={false}
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 0,
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            opacity: 0,
            transform: 'translateX(-50%)',
            animationName: `characterFrame${n}`,
            animationDuration: '3.6s',
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />
      ))}
    </div>
  )
}
