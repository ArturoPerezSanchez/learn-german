import React, { useState, useMemo } from 'react'

// Data
import { nouns, adjectives, verbs as vocabVerbs, byCategory, allCards } from './data/expandedVocabulary.js'
import { verbs }                  from './data/verbs.js'
import { fillBlankExercises, sentenceBuilderExercises } from './data/sentences.js'

// Game factories
import { createFlashcardGame }    from './games/flashcard.js'
import { createArticleGame }      from './games/articleGame.js'
import { createMultipleChoiceGame } from './games/multipleChoice.js'
import { createConjugationGame }  from './games/conjugationGame.js'
import { createFillBlankGame }    from './games/fillBlank.js'
import { createSentenceBuilderGame } from './games/sentenceBuilder.js'
import { createMatchingGame }     from './games/matchingGame.js'

// Engine
import { getCardRecords }         from './engine/progress.js'
import { pickRandom }             from './engine/utils.js'
import { audio }                  from './engine/audio.js'
import Character                  from './components/Character.jsx'

// Views
import FlashcardView      from './components/games/FlashcardView.jsx'
import ArticleView        from './components/games/ArticleView.jsx'
import MultipleChoiceView from './components/games/MultipleChoiceView.jsx'
import ConjugationView    from './components/games/ConjugationView.jsx'
import FillBlankView      from './components/games/FillBlankView.jsx'
import SentenceBuilderView from './components/games/SentenceBuilderView.jsx'
import MatchingView       from './components/games/MatchingView.jsx'

// ─── Game catalogue ───────────────────────────────────────────────────────────

const GAME_DEFS = [
  {
    id: 'flashcard',
    label: 'Flashcards',
    icon: '/images/main-menu/icons/flashcards.png',
    description: 'Flip cards — self-rate with spaced repetition',
    category: 'Vocabulary',
  },
  {
    id: 'multiple-choice-noun',
    label: 'Nouns (4-choice)',
    icon: '/images/main-menu/icons/nouns-choice.png',
    description: 'Translate the noun: German → English',
    category: 'Vocabulary',
  },
  {
    id: 'multiple-choice-adj',
    label: 'Adjectives',
    icon: '/images/main-menu/icons/adjectives.png',
    description: 'Translate the adjective: German → English',
    category: 'Vocabulary',
  },
  {
    id: 'matching',
    label: 'Matching',
    icon: '/images/main-menu/icons/matching.png',
    description: 'Match German words to English translations',
    category: 'Vocabulary',
  },
  {
    id: 'article',
    label: 'Der · Die · Das',
    icon: '/images/main-menu/icons/articles.png',
    description: 'Pick the right article for each noun',
    category: 'Grammar',
  },
  {
    id: 'conjugation-pick',
    label: 'Verb Forms',
    icon: '/images/main-menu/icons/verb-forms.png',
    description: 'Choose the correct conjugated verb form',
    category: 'Grammar',
  },
  {
    id: 'conjugation-table',
    label: 'Full Conjugation',
    icon: '/images/main-menu/icons/verb-forms.png',
    description: 'Fill in all 6 conjugation forms',
    category: 'Grammar',
  },
  {
    id: 'fill-blank-pick',
    label: 'Fill the Gap',
    icon: '/images/main-menu/icons/fill-gap.png',
    description: 'Complete sentences by choosing a word',
    category: 'Grammar',
  },
  {
    id: 'fill-blank-type',
    label: 'Fill the Gap (type)',
    icon: '/images/main-menu/icons/fill-gap.png',
    description: 'Type the missing word in the sentence',
    category: 'Grammar',
  },
  {
    id: 'sentence-builder',
    label: 'Build a Sentence',
    icon: '/images/main-menu/icons/build-sentence.png',
    description: 'Arrange word tiles in the correct order',
    category: 'Grammar',
  },
]

const CATEGORIES = [...new Set(GAME_DEFS.map(g => g.category))]

// Per-category decorative assets
const CATEGORY_VISUALS = {
  Vocabulary: {
    ribbon:  '/images/main-menu/section-ribbon-vocabulary.svg',
    corner:  '/images/main-menu/card-corner-vocabulary.svg',
    sticker: '/images/main-menu/stickers/book-pile.png',
  },
  Grammar: {
    ribbon:  '/images/main-menu/section-ribbon-grammar.svg',
    corner:  '/images/main-menu/card-corner-grammar.svg',
    sticker: '/images/main-menu/stickers/grammar-tags.png',
  },
}

// Which character appears in-game per game type
const GAME_CHARACTER = {
  'flashcard':           'child',
  'multiple-choice-noun':'child',
  'multiple-choice-adj': 'child',
  'matching':            'teen',
  'sentence-builder':    'teen',
  'article':             'teacher',
  'conjugation-pick':    'teacher',
  'conjugation-table':   'teacher',
  'fill-blank-pick':     'teacher',
  'fill-blank-type':     'teacher',
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeGame, setActiveGame] = useState(null)

  const startGame = (gameId) => {
    audio.stopMusic()
    setActiveGame(gameId)
  }
  const goToMenu = () => {
    audio.stopMusic()
    setActiveGame(null)
  }

  const gameComponent = useMemo(() => {
    if (!activeGame) return null
    return buildGame(activeGame, goToMenu)
  }, [activeGame])

  if (activeGame && gameComponent) {
    const characterId = GAME_CHARACTER[activeGame] ?? 'teacher'
    return (
      <div style={s.appGame}>
        <button style={s.backBtn} onClick={goToMenu}>← Menu</button>
        {gameComponent}
        <div style={s.floatingChar} aria-hidden="true">
          <Character id={characterId} size={110} />
        </div>
      </div>
    )
  }

  return (
    <div style={s.appMenu}>
      {/* Town background illustration */}
      <div style={s.bgLayer}>
        <img src="/images/main-menu/main-menu-background-town.png" alt="" style={s.bgImg} />
      </div>

      <div style={s.menuContent}>
        {/* Hero header — teacher + title with scattered-sticker decoration overlay */}
        <header style={s.header}>
          <img
            src="/images/main-menu/hero-decoration.png"
            alt=""
            aria-hidden="true"
            style={s.heroDecor}
          />
          <Character id="teacher" size={100} style={{ position: 'relative', zIndex: 1 }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={s.title}>Learn German</h1>
            <p style={s.subtitle}>Pick a game to start</p>
          </div>
        </header>

        {/* Game sections */}
        {CATEGORIES.map(cat => {
          const vis = CATEGORY_VISUALS[cat] ?? {}
          return (
            <section key={cat} style={s.section}>
              {/* Section ribbon — SVG as CSS background so text/sticker are normal children */}
              <div style={{
                ...s.sectionHead,
                backgroundImage: `url(${vis.ribbon})`,
              }}>
                <span style={s.catLabel}>{cat}</span>
                <img src={vis.sticker} alt="" aria-hidden="true" style={s.sectionSticker} />
              </div>

              <div style={s.grid}>
                {GAME_DEFS.filter(g => g.category === cat).map(g => (
                  <button key={g.id} style={s.gameCard} onClick={() => startGame(g.id)}>
                    {/* Subtle category corner accent */}
                    <img src={vis.corner} alt="" aria-hidden="true" style={s.cardCorner} />
                    {/* 3D game mode icon */}
                    <img src={g.icon} alt="" style={s.gameIconImg} />
                    <div style={s.gameLabel}>{g.label}</div>
                    <div style={s.gameDesc}>{g.description}</div>
                  </button>
                ))}
              </div>
            </section>
          )
        })}

        {/* Footer with wave band */}
        <footer style={s.footer}>
          <img src="/images/main-menu/footer-progress-band.svg" alt="" aria-hidden="true" style={s.footerBand} />
          <span style={s.footerText}>{allCards.length} vocabulary cards · A1–A2</span>
        </footer>
      </div>
    </div>
  )
}

// ─── Game builder ─────────────────────────────────────────────────────────────

function buildGame(gameId, onMenu) {
  const cardRecords = getCardRecords()

  switch (gameId) {
    case 'flashcard': {
      const items = pickRandom(allCards, 20)
      return <FlashcardView game={createFlashcardGame({ items, cardRecords })} onMenu={onMenu} />
    }
    case 'article': {
      return <ArticleView game={createArticleGame({ nouns: pickRandom(nouns, 20) })} onMenu={onMenu} />
    }
    case 'multiple-choice-noun': {
      const pool = pickRandom(nouns, 20)
      return <MultipleChoiceView game={createMultipleChoiceGame({ items: pool })} gameType="multiple-choice-noun" onMenu={onMenu} />
    }
    case 'multiple-choice-adj': {
      const pool = pickRandom(adjectives, 20)
      return <MultipleChoiceView game={createMultipleChoiceGame({ items: pool })} gameType="multiple-choice-adj" onMenu={onMenu} />
    }
    case 'matching': {
      const pool = pickRandom([...nouns, ...adjectives], 8)
      return <MatchingView game={createMatchingGame({ items: pool, pairCount: 8 })} onMenu={onMenu} />
    }
    case 'conjugation-pick': {
      return <ConjugationView game={createConjugationGame({ verbs: pickRandom(verbs, 5), mode: 'pick-form' })} onMenu={onMenu} />
    }
    case 'conjugation-table': {
      return <ConjugationView game={createConjugationGame({ verbs: pickRandom(verbs, 5), mode: 'full-table' })} onMenu={onMenu} />
    }
    case 'fill-blank-pick': {
      return <FillBlankView game={createFillBlankGame({ exercises: fillBlankExercises, inputMode: 'pick' })} onMenu={onMenu} />
    }
    case 'fill-blank-type': {
      return <FillBlankView game={createFillBlankGame({ exercises: fillBlankExercises, inputMode: 'type' })} onMenu={onMenu} />
    }
    case 'sentence-builder': {
      return <SentenceBuilderView game={createSentenceBuilderGame({ exercises: pickRandom(sentenceBuilderExercises, 10) })} onMenu={onMenu} />
    }
    default:
      return null
  }
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = {
  // ── Game screen ──
  appGame: { minHeight: '100vh', background: 'var(--color-mist)', padding: 'var(--space-md)', position: 'relative' },
  backBtn: {
    marginBottom: 12, padding: '6px 14px',
    borderRadius: 'var(--radius-md)', border: '1px solid var(--color-line)',
    background: 'var(--color-paper)', cursor: 'pointer', fontSize: 14,
    fontWeight: 600, color: 'var(--color-ink)',
  },
  floatingChar: { position: 'fixed', bottom: 0, right: 16, pointerEvents: 'none', zIndex: 10 },

  // ── Menu screen ──
  appMenu:     { minHeight: '100vh', position: 'relative' },
  bgLayer:     { position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' },
  bgImg:       { width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 },
  menuContent: {
    position: 'relative', zIndex: 1,
    maxWidth: 680, margin: '0 auto', padding: 'var(--space-lg)',
  },

  // ── Hero header ──
  header: {
    display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
    marginBottom: 'var(--space-xl)',
    background: 'var(--color-paper)', borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-md) var(--space-lg)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
    position: 'relative', overflow: 'hidden',
  },
  heroDecor: {
    position: 'absolute', inset: 0,
    width: '100%', height: '100%',
    objectFit: 'cover', objectPosition: 'center',
    opacity: 0.6, pointerEvents: 'none', zIndex: 0,
  },
  title:    { fontSize: 30, fontWeight: 900, color: 'var(--color-ink)', fontFamily: 'var(--font-display)' },
  subtitle: { fontSize: 15, color: 'var(--color-spruce)', marginTop: 2 },

  // ── Section ribbons ──
  section: { marginBottom: 'var(--space-xl)' },
  sectionHead: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: 52, marginBottom: 14,
    position: 'relative',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
  },
  catLabel: {
    fontSize: 13, fontWeight: 900, textTransform: 'uppercase',
    letterSpacing: 1.5, color: '#FFFDF7',
  },
  sectionSticker: {
    position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
    width: 44, height: 44, objectFit: 'contain',
  },

  // ── Game cards ──
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: 12 },
  gameCard: {
    background: 'var(--color-paper)', borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-md)', border: '2px solid var(--color-line)',
    cursor: 'pointer', textAlign: 'left',
    display: 'flex', flexDirection: 'column', gap: 4,
    transition: 'box-shadow var(--motion-standard), transform var(--motion-fast)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    position: 'relative', overflow: 'hidden',
  },
  cardCorner: {
    position: 'absolute', top: 0, right: 0,
    width: 72, height: 58,
    objectFit: 'cover', objectPosition: 'top right',
    opacity: 0.22, pointerEvents: 'none', zIndex: 0,
  },
  gameIconImg: {
    width: 52, height: 52, objectFit: 'contain',
    marginBottom: 4, position: 'relative', zIndex: 1,
  },
  gameLabel: { fontWeight: 800, fontSize: 14, color: 'var(--color-ink)', position: 'relative', zIndex: 1 },
  gameDesc:  { fontSize: 12, color: 'var(--color-spruce)', lineHeight: 1.4, position: 'relative', zIndex: 1 },

  // ── Footer ──
  footer: {
    position: 'relative', textAlign: 'center',
    marginTop: 'var(--space-xl)', paddingBottom: 60,
  },
  footerBand: {
    position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
    width: '140%', pointerEvents: 'none', opacity: 0.75,
  },
  footerText: {
    position: 'relative', zIndex: 1,
    fontSize: 12, color: 'var(--color-spruce)', opacity: 0.85,
  },
}
