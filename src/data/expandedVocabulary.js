/**
 * Adapter over assets/data/vocabulary-expanded.json.
 *
 * The JSON paths look like "../images/cards/generated/der-apfel.svg"
 * (relative from assets/data/).  With publicDir:'assets' in vite.config,
 * those files are served at /images/cards/generated/der-apfel.svg.
 *
 * Normalised card shape (used by all game factories):
 * {
 *   id, de, en, article,          // core fields
 *   category, level, partOfSpeech,
 *   imageUrl,                     // absolute URL for <img> — null if not found
 *   visualCue,                    // emoji
 * }
 */

import rawData from '../../assets/data/vocabulary-expanded.json'

function toAbsoluteUrl(relPath) {
  if (!relPath) return null
  // "../images/cards/generated/foo.svg" → "/images/cards/generated/foo.svg"
  return relPath.replace(/^\.\.\//, '/')
}

function normalize(card) {
  return {
    id: card.id,
    de: card.word ?? card.german,       // nouns have 'word', verbs/adj use 'german'
    en: card.english,
    article: card.article ?? null,      // null for verbs, adjectives, phrases
    category: card.category,
    level: card.level,
    partOfSpeech: card.partOfSpeech,
    imageUrl: toAbsoluteUrl(card.image),
    visualCue: card.visualCue ?? null,
  }
}

export const allCards = rawData.cards.map(normalize)

export const nouns     = allCards.filter(c => c.partOfSpeech === 'noun')
export const adjectives = allCards.filter(c => c.partOfSpeech === 'adjective')
export const verbs     = allCards.filter(c => c.partOfSpeech === 'verb')
export const phrases   = allCards.filter(c => c.partOfSpeech === 'phrase')

/** Filter by category */
export function byCategory(category) {
  return allCards.filter(c => c.category === category)
}

/** Filter by level ('A1' | 'A1-A2' | 'A2') */
export function byLevel(level) {
  return allCards.filter(c => c.level === level)
}

/** Look up one card by its id */
export function getCard(id) {
  return allCards.find(c => c.id === id) ?? null
}

export const categories = [...new Set(allCards.map(c => c.category))].sort()
export const levels     = [...new Set(allCards.map(c => c.level))].sort()
