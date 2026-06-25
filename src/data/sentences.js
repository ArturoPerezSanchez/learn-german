// Sentences used for fill-in-the-blank and sentence builder games
// fill-in-the-blank: { id, sentence (with __BLANK__), answer, hint, translation, level }
// sentence-builder: { id, words (scrambled), correct (ordered), translation, level }

export const fillBlankExercises = [
  // Articles
  { id: 'fb001', sentence: '___ Hund ist groß.', answer: 'Der', hint: 'Hund = der', translation: 'The dog is big.', topic: 'articles', level: 'A1' },
  { id: 'fb002', sentence: '___ Katze schläft.', answer: 'Die', hint: 'Katze = die', translation: 'The cat is sleeping.', topic: 'articles', level: 'A1' },
  { id: 'fb003', sentence: '___ Kind spielt.', answer: 'Das', hint: 'Kind = das', translation: 'The child is playing.', topic: 'articles', level: 'A1' },
  { id: 'fb004', sentence: 'Ich sehe ___ Mann.', answer: 'den', hint: 'Akkusativ: der → den', translation: 'I see the man.', topic: 'cases', level: 'A2' },
  { id: 'fb005', sentence: 'Er gibt ___ Frau ein Buch.', answer: 'der', hint: 'Dativ: die → der', translation: 'He gives the woman a book.', topic: 'cases', level: 'A2' },
  { id: 'fb006', sentence: 'Das ist ___ Haus meiner Mutter.', answer: 'das', hint: 'Nominativ: das Haus', translation: "That is my mother's house.", topic: 'articles', level: 'A1' },

  // Verb conjugation
  { id: 'fb010', sentence: 'Ich ___ müde.', answer: 'bin', hint: 'sein → ich', translation: 'I am tired.', topic: 'conjugation', level: 'A1' },
  { id: 'fb011', sentence: 'Du ___ Hunger.', answer: 'hast', hint: 'haben → du', translation: 'You are hungry.', topic: 'conjugation', level: 'A1' },
  { id: 'fb012', sentence: 'Er ___ schnell.', answer: 'läuft', hint: 'laufen → er', translation: 'He runs fast.', topic: 'conjugation', level: 'A2' },
  { id: 'fb013', sentence: 'Wir ___ Deutsch.', answer: 'lernen', hint: 'lernen → wir', translation: 'We are learning German.', topic: 'conjugation', level: 'A1' },
  { id: 'fb014', sentence: 'Ihr ___ heute Abend.', answer: 'kocht', hint: 'kochen → ihr', translation: 'You all are cooking tonight.', topic: 'conjugation', level: 'A1' },
  { id: 'fb015', sentence: 'Sie ___ ins Kino.', answer: 'gehen', hint: 'gehen → sie (pl.)', translation: 'They are going to the cinema.', topic: 'conjugation', level: 'A1' },

  // Vocabulary
  { id: 'fb020', sentence: 'Das Wetter ist heute sehr ___.', answer: 'schön', hint: 'beautiful / nice', translation: 'The weather is very nice today.', topic: 'vocabulary', level: 'A1' },
  { id: 'fb021', sentence: 'Ich trinke jeden Morgen ___.', answer: 'Kaffee', hint: 'hot morning drink', translation: 'I drink ___ every morning.', topic: 'vocabulary', level: 'A1' },
  { id: 'fb022', sentence: 'Der ___ kommt um 10 Uhr an.', answer: 'Zug', hint: 'train', translation: 'The train arrives at 10 o\'clock.', topic: 'vocabulary', level: 'A1' },
  { id: 'fb023', sentence: 'Sie kauft Gemüse im ___.', answer: 'Supermarkt', hint: 'where you buy groceries', translation: 'She buys vegetables at the supermarket.', topic: 'vocabulary', level: 'A1' },

  // Modal verbs
  { id: 'fb030', sentence: 'Ich ___ Deutsch sprechen.', answer: 'kann', hint: 'können → ich', translation: 'I can speak German.', topic: 'modal', level: 'A1' },
  { id: 'fb031', sentence: 'Du ___ jetzt schlafen.', answer: 'musst', hint: 'müssen → du', translation: 'You must sleep now.', topic: 'modal', level: 'A1' },
  { id: 'fb032', sentence: 'Er ___ nicht rauchen.', answer: 'darf', hint: 'dürfen → er', translation: 'He is not allowed to smoke.', topic: 'modal', level: 'A2' },
  { id: 'fb033', sentence: 'Wir ___ heute ins Kino gehen.', answer: 'wollen', hint: 'wollen → wir', translation: 'We want to go to the cinema today.', topic: 'modal', level: 'A1' },

  // Prepositions
  { id: 'fb040', sentence: 'Das Buch liegt ___ dem Tisch.', answer: 'auf', hint: 'on top of', translation: 'The book is on the table.', topic: 'prepositions', level: 'A2' },
  { id: 'fb041', sentence: 'Die Katze sitzt ___ dem Stuhl.', answer: 'unter', hint: 'below / under', translation: 'The cat is sitting under the chair.', topic: 'prepositions', level: 'A2' },
  { id: 'fb042', sentence: 'Ich fahre ___ Berlin.', answer: 'nach', hint: 'direction to a city', translation: 'I am travelling to Berlin.', topic: 'prepositions', level: 'A1' },
  { id: 'fb043', sentence: 'Er kommt ___ Spanien.', answer: 'aus', hint: 'origin / from', translation: 'He comes from Spain.', topic: 'prepositions', level: 'A1' },
]

export const sentenceBuilderExercises = [
  { id: 'sb001', correct: ['Ich', 'bin', 'müde'], translation: 'I am tired.', level: 'A1' },
  { id: 'sb002', correct: ['Du', 'hast', 'Hunger'], translation: 'You are hungry.', level: 'A1' },
  { id: 'sb003', correct: ['Er', 'spricht', 'Deutsch'], translation: 'He speaks German.', level: 'A1' },
  { id: 'sb004', correct: ['Wir', 'lernen', 'jeden', 'Tag'], translation: 'We learn every day.', level: 'A1' },
  { id: 'sb005', correct: ['Die', 'Katze', 'schläft', 'auf', 'dem', 'Bett'], translation: 'The cat sleeps on the bed.', level: 'A2' },
  { id: 'sb006', correct: ['Ich', 'möchte', 'ein', 'Glas', 'Wasser'], translation: 'I would like a glass of water.', level: 'A1' },
  { id: 'sb007', correct: ['Wo', 'ist', 'der', 'Bahnhof'], translation: 'Where is the train station?', level: 'A1' },
  { id: 'sb008', correct: ['Kannst', 'du', 'mir', 'helfen'], translation: 'Can you help me?', level: 'A2' },
  { id: 'sb009', correct: ['Das', 'Wetter', 'ist', 'heute', 'schön'], translation: 'The weather is nice today.', level: 'A1' },
  { id: 'sb010', correct: ['Er', 'fährt', 'morgen', 'nach', 'Berlin'], translation: 'He is travelling to Berlin tomorrow.', level: 'A2' },
  { id: 'sb011', correct: ['Sie', 'kauft', 'Brot', 'im', 'Supermarkt'], translation: 'She buys bread at the supermarket.', level: 'A1' },
  { id: 'sb012', correct: ['Ich', 'muss', 'jetzt', 'nach', 'Hause', 'gehen'], translation: 'I have to go home now.', level: 'A2' },
  { id: 'sb013', correct: ['Haben', 'Sie', 'einen', 'Tisch', 'für', 'zwei'], translation: 'Do you have a table for two?', level: 'A2' },
  { id: 'sb014', correct: ['Meine', 'Mutter', 'kocht', 'sehr', 'gut'], translation: 'My mother cooks very well.', level: 'A1' },
  { id: 'sb015', correct: ['Warum', 'lernst', 'du', 'Deutsch'], translation: 'Why are you learning German?', level: 'A1' },
]
