# German Learning App Asset Pack

This folder contains an original, family-friendly asset pack for a professional German learning web app. Everything here is safe to edit and ship inside this project without third-party media attribution.

## Folder Map

- `brand/` - color, typography, spacing, motion, and UI tone tokens.
- `data/` - app-ready starter vocabulary, lesson themes, achievements, and UI copy.
- `images/backgrounds/` - calm SVG scene backgrounds for dashboard, lesson, quiz, and celebration states.
- `images/main-menu/` - background art, polished game-mode icons, stickers, and SVG accents for the game selection menu.
- `images/feedback-states/` - transparent PNG feedback stickers for correct answers, hints, retries, streaks, and completion moments.
- `images/extended/` - 532 generated SVG assets for achievements, lessons, grammar helpers, sentence tiles, particles, and UI accents.
- `images/cards/` - vocabulary card artwork with German labels, including `generated/` with 442 app-ready cards.
- `images/characters/` - friendly human guide illustrations, including polished PNG cutouts in `generated/` and four-frame animation previews in `animations/`.
- `images/icons/` - reusable SVG icons for app navigation and learning modes.
- `images/stickers/` - reward and feedback stickers.
- `audio/sfx/` - generated WAV interface sounds.
- `audio/music/` - generated WAV loop beds for study and celebration.
- `audio/voice-placeholders/` - manifest for future pronunciation recordings.
- `docs/` - developer handoff notes for integrating generated assets.
- `licenses/` - asset license and provenance notes.
- `scripts/` - generation scripts for reproducible media.

## Suggested Product Use

- Dashboard: `images/backgrounds/sunny-classroom.svg`, `images/characters/friendly-guide.svg`, `audio/music/focus_loop.wav`.
- Polished characters: use `images/characters/generated/teacher-guide-beautiful.png` for onboarding and lesson guidance.
- Animated characters: preview all four at `images/characters/animations/preview.html`; implementation notes live in `docs/character-animation-integration.md`.
- Main menu polish: use `images/main-menu/main-menu-background-town.png`, `images/main-menu/hero-decoration.png`, and `images/main-menu/icons/*.png` to upgrade the game selection screen.
- Feedback states: use `images/feedback-states/items/*.png` for correct, retry, hint, streak, and completion UI moments.
- Extended asset pack: browse `images/extended/index.html` and load paths from `images/extended/extended-assets-manifest.json`.
- Flashcards: `images/cards/*.svg`, `audio/sfx/card_flip.wav`, `audio/sfx/correct_soft.wav`.
- Expanded deck: load `data/vocabulary-expanded.json` and render each card's `image` path.
- Quiz mode: `images/backgrounds/quiz-table.svg`, `audio/sfx/incorrect_gentle.wav`, `audio/sfx/level_complete.wav`.
- Pronunciation mode: `images/icons/pronunciation.svg`, `audio/sfx/pronunciation_ping.wav`, replace placeholder voice files with native-speaker recordings later.
- Rewards: `images/stickers/*.svg`, `audio/music/celebration_loop.wav`, `audio/sfx/streak_sparkle.wav`.

## Audio Regeneration

Run this any time you want to regenerate the WAV files:

```powershell
python assets/scripts/generate_audio_assets.py
```

The generated sounds are intentionally short, gentle, and non-startling so they work well for families and younger learners.

## Vocabulary Card Regeneration

Run this any time you want to regenerate the expanded deck:

```powershell
python assets/scripts/generate_vocabulary_cards.py
```

This creates `442` SVG cards in `images/cards/generated/`, writes `data/vocabulary-expanded.json`, and builds `images/cards/generated/index.html` for browsing the full deck.

## Extended Asset Pack Regeneration

Run this any time you want to regenerate the achievement, lesson, grammar, sentence tile, particle, and UI accent pack:

```powershell
python assets/scripts/generate_extended_app_assets.py
```

This creates `532` SVG assets in `images/extended/`, writes `images/extended/extended-assets-manifest.json`, and builds `images/extended/index.html` for browsing the pack.
