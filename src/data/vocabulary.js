// Each noun: { id, de, article, en, plural, category, level }
// article: 'der' | 'die' | 'das'
// level: 'A1' | 'A2' | 'B1'

export const nouns = [
  // --- People ---
  { id: 'n001', de: 'Mann', article: 'der', en: 'man', plural: 'Männer', category: 'people', level: 'A1' },
  { id: 'n002', de: 'Frau', article: 'die', en: 'woman', plural: 'Frauen', category: 'people', level: 'A1' },
  { id: 'n003', de: 'Kind', article: 'das', en: 'child', plural: 'Kinder', category: 'people', level: 'A1' },
  { id: 'n004', de: 'Freund', article: 'der', en: 'friend (male)', plural: 'Freunde', category: 'people', level: 'A1' },
  { id: 'n005', de: 'Freundin', article: 'die', en: 'friend (female)', plural: 'Freundinnen', category: 'people', level: 'A1' },
  { id: 'n006', de: 'Mutter', article: 'die', en: 'mother', plural: 'Mütter', category: 'people', level: 'A1' },
  { id: 'n007', de: 'Vater', article: 'der', en: 'father', plural: 'Väter', category: 'people', level: 'A1' },
  { id: 'n008', de: 'Bruder', article: 'der', en: 'brother', plural: 'Brüder', category: 'people', level: 'A1' },
  { id: 'n009', de: 'Schwester', article: 'die', en: 'sister', plural: 'Schwestern', category: 'people', level: 'A1' },
  { id: 'n010', de: 'Lehrer', article: 'der', en: 'teacher (male)', plural: 'Lehrer', category: 'people', level: 'A1' },
  { id: 'n011', de: 'Lehrerin', article: 'die', en: 'teacher (female)', plural: 'Lehrerinnen', category: 'people', level: 'A1' },
  { id: 'n012', de: 'Arzt', article: 'der', en: 'doctor (male)', plural: 'Ärzte', category: 'people', level: 'A2' },
  { id: 'n013', de: 'Ärztin', article: 'die', en: 'doctor (female)', plural: 'Ärztinnen', category: 'people', level: 'A2' },

  // --- Food & Drink ---
  { id: 'n020', de: 'Brot', article: 'das', en: 'bread', plural: 'Brote', category: 'food', level: 'A1' },
  { id: 'n021', de: 'Wasser', article: 'das', en: 'water', plural: 'Wässer', category: 'food', level: 'A1' },
  { id: 'n022', de: 'Milch', article: 'die', en: 'milk', plural: '-', category: 'food', level: 'A1' },
  { id: 'n023', de: 'Kaffee', article: 'der', en: 'coffee', plural: 'Kaffees', category: 'food', level: 'A1' },
  { id: 'n024', de: 'Tee', article: 'der', en: 'tea', plural: 'Tees', category: 'food', level: 'A1' },
  { id: 'n025', de: 'Apfel', article: 'der', en: 'apple', plural: 'Äpfel', category: 'food', level: 'A1' },
  { id: 'n026', de: 'Banane', article: 'die', en: 'banana', plural: 'Bananen', category: 'food', level: 'A1' },
  { id: 'n027', de: 'Fleisch', article: 'das', en: 'meat', plural: '-', category: 'food', level: 'A1' },
  { id: 'n028', de: 'Fisch', article: 'der', en: 'fish', plural: 'Fische', category: 'food', level: 'A1' },
  { id: 'n029', de: 'Käse', article: 'der', en: 'cheese', plural: 'Käsesorten', category: 'food', level: 'A1' },
  { id: 'n030', de: 'Ei', article: 'das', en: 'egg', plural: 'Eier', category: 'food', level: 'A1' },
  { id: 'n031', de: 'Suppe', article: 'die', en: 'soup', plural: 'Suppen', category: 'food', level: 'A1' },
  { id: 'n032', de: 'Kuchen', article: 'der', en: 'cake', plural: 'Kuchen', category: 'food', level: 'A1' },

  // --- Animals ---
  { id: 'n040', de: 'Hund', article: 'der', en: 'dog', plural: 'Hunde', category: 'animals', level: 'A1' },
  { id: 'n041', de: 'Katze', article: 'die', en: 'cat', plural: 'Katzen', category: 'animals', level: 'A1' },
  { id: 'n042', de: 'Vogel', article: 'der', en: 'bird', plural: 'Vögel', category: 'animals', level: 'A1' },
  { id: 'n043', de: 'Pferd', article: 'das', en: 'horse', plural: 'Pferde', category: 'animals', level: 'A1' },
  { id: 'n044', de: 'Kuh', article: 'die', en: 'cow', plural: 'Kühe', category: 'animals', level: 'A1' },
  { id: 'n045', de: 'Maus', article: 'die', en: 'mouse', plural: 'Mäuse', category: 'animals', level: 'A1' },
  { id: 'n046', de: 'Fisch', article: 'der', en: 'fish', plural: 'Fische', category: 'animals', level: 'A1' },
  { id: 'n047', de: 'Löwe', article: 'der', en: 'lion', plural: 'Löwen', category: 'animals', level: 'A2' },
  { id: 'n048', de: 'Elefant', article: 'der', en: 'elephant', plural: 'Elefanten', category: 'animals', level: 'A2' },
  { id: 'n049', de: 'Schlange', article: 'die', en: 'snake', plural: 'Schlangen', category: 'animals', level: 'A2' },

  // --- Home & Objects ---
  { id: 'n060', de: 'Haus', article: 'das', en: 'house', plural: 'Häuser', category: 'home', level: 'A1' },
  { id: 'n061', de: 'Wohnung', article: 'die', en: 'apartment', plural: 'Wohnungen', category: 'home', level: 'A1' },
  { id: 'n062', de: 'Zimmer', article: 'das', en: 'room', plural: 'Zimmer', category: 'home', level: 'A1' },
  { id: 'n063', de: 'Tisch', article: 'der', en: 'table', plural: 'Tische', category: 'home', level: 'A1' },
  { id: 'n064', de: 'Stuhl', article: 'der', en: 'chair', plural: 'Stühle', category: 'home', level: 'A1' },
  { id: 'n065', de: 'Bett', article: 'das', en: 'bed', plural: 'Betten', category: 'home', level: 'A1' },
  { id: 'n066', de: 'Tür', article: 'die', en: 'door', plural: 'Türen', category: 'home', level: 'A1' },
  { id: 'n067', de: 'Fenster', article: 'das', en: 'window', plural: 'Fenster', category: 'home', level: 'A1' },
  { id: 'n068', de: 'Küche', article: 'die', en: 'kitchen', plural: 'Küchen', category: 'home', level: 'A1' },
  { id: 'n069', de: 'Schlafzimmer', article: 'das', en: 'bedroom', plural: 'Schlafzimmer', category: 'home', level: 'A1' },
  { id: 'n070', de: 'Badezimmer', article: 'das', en: 'bathroom', plural: 'Badezimmer', category: 'home', level: 'A1' },

  // --- City & Places ---
  { id: 'n080', de: 'Stadt', article: 'die', en: 'city', plural: 'Städte', category: 'places', level: 'A1' },
  { id: 'n081', de: 'Straße', article: 'die', en: 'street', plural: 'Straßen', category: 'places', level: 'A1' },
  { id: 'n082', de: 'Schule', article: 'die', en: 'school', plural: 'Schulen', category: 'places', level: 'A1' },
  { id: 'n083', de: 'Bahnhof', article: 'der', en: 'train station', plural: 'Bahnhöfe', category: 'places', level: 'A1' },
  { id: 'n084', de: 'Flughafen', article: 'der', en: 'airport', plural: 'Flughäfen', category: 'places', level: 'A2' },
  { id: 'n085', de: 'Krankenhaus', article: 'das', en: 'hospital', plural: 'Krankenhäuser', category: 'places', level: 'A2' },
  { id: 'n086', de: 'Supermarkt', article: 'der', en: 'supermarket', plural: 'Supermärkte', category: 'places', level: 'A1' },
  { id: 'n087', de: 'Restaurant', article: 'das', en: 'restaurant', plural: 'Restaurants', category: 'places', level: 'A1' },
  { id: 'n088', de: 'Park', article: 'der', en: 'park', plural: 'Parks', category: 'places', level: 'A1' },

  // --- Time ---
  { id: 'n100', de: 'Tag', article: 'der', en: 'day', plural: 'Tage', category: 'time', level: 'A1' },
  { id: 'n101', de: 'Nacht', article: 'die', en: 'night', plural: 'Nächte', category: 'time', level: 'A1' },
  { id: 'n102', de: 'Woche', article: 'die', en: 'week', plural: 'Wochen', category: 'time', level: 'A1' },
  { id: 'n103', de: 'Monat', article: 'der', en: 'month', plural: 'Monate', category: 'time', level: 'A1' },
  { id: 'n104', de: 'Jahr', article: 'das', en: 'year', plural: 'Jahre', category: 'time', level: 'A1' },
  { id: 'n105', de: 'Stunde', article: 'die', en: 'hour', plural: 'Stunden', category: 'time', level: 'A1' },
  { id: 'n106', de: 'Minute', article: 'die', en: 'minute', plural: 'Minuten', category: 'time', level: 'A1' },

  // --- Body ---
  { id: 'n110', de: 'Kopf', article: 'der', en: 'head', plural: 'Köpfe', category: 'body', level: 'A1' },
  { id: 'n111', de: 'Hand', article: 'die', en: 'hand', plural: 'Hände', category: 'body', level: 'A1' },
  { id: 'n112', de: 'Auge', article: 'das', en: 'eye', plural: 'Augen', category: 'body', level: 'A1' },
  { id: 'n113', de: 'Ohr', article: 'das', en: 'ear', plural: 'Ohren', category: 'body', level: 'A1' },
  { id: 'n114', de: 'Nase', article: 'die', en: 'nose', plural: 'Nasen', category: 'body', level: 'A1' },
  { id: 'n115', de: 'Mund', article: 'der', en: 'mouth', plural: 'Münder', category: 'body', level: 'A1' },
  { id: 'n116', de: 'Fuß', article: 'der', en: 'foot', plural: 'Füße', category: 'body', level: 'A1' },
  { id: 'n117', de: 'Bein', article: 'das', en: 'leg', plural: 'Beine', category: 'body', level: 'A1' },
  { id: 'n118', de: 'Arm', article: 'der', en: 'arm', plural: 'Arme', category: 'body', level: 'A1' },
]

// Each word entry: { id, de, en, type, category, level, example }
// type: 'adjective' | 'adverb' | 'preposition' | 'conjunction'
export const words = [
  // Adjectives
  { id: 'w001', de: 'groß', en: 'big / tall', type: 'adjective', category: 'size', level: 'A1' },
  { id: 'w002', de: 'klein', en: 'small / short', type: 'adjective', category: 'size', level: 'A1' },
  { id: 'w003', de: 'alt', en: 'old', type: 'adjective', category: 'description', level: 'A1' },
  { id: 'w004', de: 'neu', en: 'new', type: 'adjective', category: 'description', level: 'A1' },
  { id: 'w005', de: 'gut', en: 'good', type: 'adjective', category: 'quality', level: 'A1' },
  { id: 'w006', de: 'schlecht', en: 'bad', type: 'adjective', category: 'quality', level: 'A1' },
  { id: 'w007', de: 'schön', en: 'beautiful / nice', type: 'adjective', category: 'quality', level: 'A1' },
  { id: 'w008', de: 'hässlich', en: 'ugly', type: 'adjective', category: 'quality', level: 'A2' },
  { id: 'w009', de: 'schnell', en: 'fast', type: 'adjective', category: 'speed', level: 'A1' },
  { id: 'w010', de: 'langsam', en: 'slow', type: 'adjective', category: 'speed', level: 'A1' },
  { id: 'w011', de: 'warm', en: 'warm', type: 'adjective', category: 'temperature', level: 'A1' },
  { id: 'w012', de: 'kalt', en: 'cold', type: 'adjective', category: 'temperature', level: 'A1' },
  { id: 'w013', de: 'heiß', en: 'hot', type: 'adjective', category: 'temperature', level: 'A1' },
  { id: 'w014', de: 'teuer', en: 'expensive', type: 'adjective', category: 'price', level: 'A1' },
  { id: 'w015', de: 'billig', en: 'cheap', type: 'adjective', category: 'price', level: 'A1' },
  { id: 'w016', de: 'müde', en: 'tired', type: 'adjective', category: 'feeling', level: 'A1' },
  { id: 'w017', de: 'hungrig', en: 'hungry', type: 'adjective', category: 'feeling', level: 'A1' },
  { id: 'w018', de: 'glücklich', en: 'happy', type: 'adjective', category: 'feeling', level: 'A1' },
  { id: 'w019', de: 'traurig', en: 'sad', type: 'adjective', category: 'feeling', level: 'A1' },
  { id: 'w020', de: 'schwer', en: 'heavy / difficult', type: 'adjective', category: 'description', level: 'A1' },
  { id: 'w021', de: 'leicht', en: 'light / easy', type: 'adjective', category: 'description', level: 'A1' },
  // Colors
  { id: 'w030', de: 'rot', en: 'red', type: 'adjective', category: 'color', level: 'A1' },
  { id: 'w031', de: 'blau', en: 'blue', type: 'adjective', category: 'color', level: 'A1' },
  { id: 'w032', de: 'grün', en: 'green', type: 'adjective', category: 'color', level: 'A1' },
  { id: 'w033', de: 'gelb', en: 'yellow', type: 'adjective', category: 'color', level: 'A1' },
  { id: 'w034', de: 'schwarz', en: 'black', type: 'adjective', category: 'color', level: 'A1' },
  { id: 'w035', de: 'weiß', en: 'white', type: 'adjective', category: 'color', level: 'A1' },
  { id: 'w036', de: 'braun', en: 'brown', type: 'adjective', category: 'color', level: 'A1' },
  { id: 'w037', de: 'grau', en: 'grey', type: 'adjective', category: 'color', level: 'A1' },
  { id: 'w038', de: 'orange', en: 'orange', type: 'adjective', category: 'color', level: 'A1' },
  { id: 'w039', de: 'lila', en: 'purple', type: 'adjective', category: 'color', level: 'A1' },
]
