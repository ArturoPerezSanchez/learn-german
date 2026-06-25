/**
 * Verb Conjugation Game
 *
 * Three modes:
 *   'pick-form'  — shown verb + pronoun, pick correct conjugated form from 4 options
 *   'pick-verb'  — shown a conjugated form + pronoun, identify which infinitive it belongs to
 *   'full-table' — complete an entire conjugation table (6 forms)
 *
 * createConjugationGame({ verbs, mode }) →
 *   { questions, check(question, answer) → { correct, correctAnswer } }
 */

import { shuffle, pickRandom } from '../engine/utils.js'
import { pronouns, pronounLabels } from '../data/verbs.js'

export function createConjugationGame({ verbs, mode = 'pick-form' }) {
  let questions

  if (mode === 'pick-form') {
    questions = buildPickFormQuestions(verbs)
  } else if (mode === 'pick-verb') {
    questions = buildPickVerbQuestions(verbs)
  } else if (mode === 'full-table') {
    questions = buildFullTableQuestions(verbs)
  } else {
    questions = buildPickFormQuestions(verbs)
  }

  return {
    questions: shuffle(questions),

    /**
     * For 'pick-form' and 'pick-verb': answer is a string.
     * For 'full-table': answer is an object { ich, du, er, wir, ihr, sie }.
     */
    check(question, answer) {
      if (question.mode === 'full-table') {
        const results = {}
        let allCorrect = true
        for (const pronoun of pronouns) {
          const correct = answer[pronoun]?.trim().toLowerCase() === question.correctTable[pronoun].toLowerCase()
          results[pronoun] = correct
          if (!correct) allCorrect = false
        }
        return { correct: allCorrect, results, correctTable: question.correctTable }
      }

      const correct = answer?.trim().toLowerCase() === question.correctAnswer.toLowerCase()
      return { correct, correctAnswer: question.correctAnswer }
    },
  }
}

function buildPickFormQuestions(verbs) {
  const questions = []
  for (const verb of verbs) {
    for (const pronoun of pronouns) {
      const correctForm = verb.conjugation[pronoun]
      const allForms = verbs.flatMap(v => Object.values(v.conjugation))
      const distractors = [...new Set(allForms)].filter(f => f !== correctForm)
      const options = shuffle([correctForm, ...pickRandom(distractors, 3)])

      questions.push({
        id: `conj-pf-${verb.id}-${pronoun}`,
        type: 'conjugation',
        mode: 'pick-form',
        verb: verb.infinitive,
        verbEn: verb.en,
        pronoun,
        pronounLabel: pronounLabels[pronoun],
        prompt: `${pronounLabels[pronoun]} + ${verb.infinitive} (${verb.en})`,
        options,
        correctAnswer: correctForm,
      })
    }
  }
  return questions
}

function buildPickVerbQuestions(verbs) {
  const questions = []
  for (const verb of verbs) {
    const pronoun = pronouns[Math.floor(Math.random() * pronouns.length)]
    const form = verb.conjugation[pronoun]
    const distractors = pickRandom(verbs.filter(v => v.id !== verb.id), 3)
    const options = shuffle([verb.infinitive, ...distractors.map(v => v.infinitive)])

    questions.push({
      id: `conj-pv-${verb.id}-${pronoun}`,
      type: 'conjugation',
      mode: 'pick-verb',
      form,
      pronoun,
      pronounLabel: pronounLabels[pronoun],
      prompt: `"${form}" — ${pronounLabels[pronoun]}. Which verb?`,
      options,
      correctAnswer: verb.infinitive,
    })
  }
  return questions
}

function buildFullTableQuestions(verbs) {
  return verbs.map(verb => ({
    id: `conj-ft-${verb.id}`,
    type: 'conjugation',
    mode: 'full-table',
    verb: verb.infinitive,
    verbEn: verb.en,
    prompt: `Complete the conjugation table for "${verb.infinitive}" (${verb.en})`,
    correctTable: verb.conjugation,
  }))
}
