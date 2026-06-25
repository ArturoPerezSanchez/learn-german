// Each verb: { id, infinitive, en, type, auxiliary, pastParticiple, level, conjugation }
// type: 'regular' | 'irregular' | 'separable' | 'modal'
// conjugation: present tense { ich, du, er, wir, ihr, sie }

export const verbs = [
  {
    id: 'v001', infinitive: 'sein', en: 'to be', type: 'irregular', auxiliary: 'sein',
    pastParticiple: 'gewesen', level: 'A1',
    conjugation: { ich: 'bin', du: 'bist', er: 'ist', wir: 'sind', ihr: 'seid', sie: 'sind' },
  },
  {
    id: 'v002', infinitive: 'haben', en: 'to have', type: 'irregular', auxiliary: 'haben',
    pastParticiple: 'gehabt', level: 'A1',
    conjugation: { ich: 'habe', du: 'hast', er: 'hat', wir: 'haben', ihr: 'habt', sie: 'haben' },
  },
  {
    id: 'v003', infinitive: 'werden', en: 'to become', type: 'irregular', auxiliary: 'sein',
    pastParticiple: 'geworden', level: 'A2',
    conjugation: { ich: 'werde', du: 'wirst', er: 'wird', wir: 'werden', ihr: 'werdet', sie: 'werden' },
  },
  {
    id: 'v004', infinitive: 'machen', en: 'to make / to do', type: 'regular', auxiliary: 'haben',
    pastParticiple: 'gemacht', level: 'A1',
    conjugation: { ich: 'mache', du: 'machst', er: 'macht', wir: 'machen', ihr: 'macht', sie: 'machen' },
  },
  {
    id: 'v005', infinitive: 'gehen', en: 'to go', type: 'irregular', auxiliary: 'sein',
    pastParticiple: 'gegangen', level: 'A1',
    conjugation: { ich: 'gehe', du: 'gehst', er: 'geht', wir: 'gehen', ihr: 'geht', sie: 'gehen' },
  },
  {
    id: 'v006', infinitive: 'kommen', en: 'to come', type: 'irregular', auxiliary: 'sein',
    pastParticiple: 'gekommen', level: 'A1',
    conjugation: { ich: 'komme', du: 'kommst', er: 'kommt', wir: 'kommen', ihr: 'kommt', sie: 'kommen' },
  },
  {
    id: 'v007', infinitive: 'sehen', en: 'to see', type: 'irregular', auxiliary: 'haben',
    pastParticiple: 'gesehen', level: 'A1',
    conjugation: { ich: 'sehe', du: 'siehst', er: 'sieht', wir: 'sehen', ihr: 'seht', sie: 'sehen' },
  },
  {
    id: 'v008', infinitive: 'essen', en: 'to eat', type: 'irregular', auxiliary: 'haben',
    pastParticiple: 'gegessen', level: 'A1',
    conjugation: { ich: 'esse', du: 'isst', er: 'isst', wir: 'essen', ihr: 'esst', sie: 'essen' },
  },
  {
    id: 'v009', infinitive: 'trinken', en: 'to drink', type: 'irregular', auxiliary: 'haben',
    pastParticiple: 'getrunken', level: 'A1',
    conjugation: { ich: 'trinke', du: 'trinkst', er: 'trinkt', wir: 'trinken', ihr: 'trinkt', sie: 'trinken' },
  },
  {
    id: 'v010', infinitive: 'schlafen', en: 'to sleep', type: 'irregular', auxiliary: 'haben',
    pastParticiple: 'geschlafen', level: 'A1',
    conjugation: { ich: 'schlafe', du: 'schläfst', er: 'schläft', wir: 'schlafen', ihr: 'schlaft', sie: 'schlafen' },
  },
  {
    id: 'v011', infinitive: 'sprechen', en: 'to speak', type: 'irregular', auxiliary: 'haben',
    pastParticiple: 'gesprochen', level: 'A1',
    conjugation: { ich: 'spreche', du: 'sprichst', er: 'spricht', wir: 'sprechen', ihr: 'sprecht', sie: 'sprechen' },
  },
  {
    id: 'v012', infinitive: 'lesen', en: 'to read', type: 'irregular', auxiliary: 'haben',
    pastParticiple: 'gelesen', level: 'A1',
    conjugation: { ich: 'lese', du: 'liest', er: 'liest', wir: 'lesen', ihr: 'lest', sie: 'lesen' },
  },
  {
    id: 'v013', infinitive: 'schreiben', en: 'to write', type: 'irregular', auxiliary: 'haben',
    pastParticiple: 'geschrieben', level: 'A1',
    conjugation: { ich: 'schreibe', du: 'schreibst', er: 'schreibt', wir: 'schreiben', ihr: 'schreibt', sie: 'schreiben' },
  },
  {
    id: 'v014', infinitive: 'kaufen', en: 'to buy', type: 'regular', auxiliary: 'haben',
    pastParticiple: 'gekauft', level: 'A1',
    conjugation: { ich: 'kaufe', du: 'kaufst', er: 'kauft', wir: 'kaufen', ihr: 'kauft', sie: 'kaufen' },
  },
  {
    id: 'v015', infinitive: 'arbeiten', en: 'to work', type: 'regular', auxiliary: 'haben',
    pastParticiple: 'gearbeitet', level: 'A1',
    conjugation: { ich: 'arbeite', du: 'arbeitest', er: 'arbeitet', wir: 'arbeiten', ihr: 'arbeitet', sie: 'arbeiten' },
  },
  {
    id: 'v016', infinitive: 'spielen', en: 'to play', type: 'regular', auxiliary: 'haben',
    pastParticiple: 'gespielt', level: 'A1',
    conjugation: { ich: 'spiele', du: 'spielst', er: 'spielt', wir: 'spielen', ihr: 'spielt', sie: 'spielen' },
  },
  {
    id: 'v017', infinitive: 'lernen', en: 'to learn', type: 'regular', auxiliary: 'haben',
    pastParticiple: 'gelernt', level: 'A1',
    conjugation: { ich: 'lerne', du: 'lernst', er: 'lernt', wir: 'lernen', ihr: 'lernt', sie: 'lernen' },
  },
  {
    id: 'v018', infinitive: 'wohnen', en: 'to live (reside)', type: 'regular', auxiliary: 'haben',
    pastParticiple: 'gewohnt', level: 'A1',
    conjugation: { ich: 'wohne', du: 'wohnst', er: 'wohnt', wir: 'wohnen', ihr: 'wohnt', sie: 'wohnen' },
  },
  {
    id: 'v019', infinitive: 'fahren', en: 'to drive / travel', type: 'irregular', auxiliary: 'sein',
    pastParticiple: 'gefahren', level: 'A1',
    conjugation: { ich: 'fahre', du: 'fährst', er: 'fährt', wir: 'fahren', ihr: 'fahrt', sie: 'fahren' },
  },
  {
    id: 'v020', infinitive: 'finden', en: 'to find', type: 'irregular', auxiliary: 'haben',
    pastParticiple: 'gefunden', level: 'A1',
    conjugation: { ich: 'finde', du: 'findest', er: 'findet', wir: 'finden', ihr: 'findet', sie: 'finden' },
  },
  {
    id: 'v021', infinitive: 'helfen', en: 'to help', type: 'irregular', auxiliary: 'haben',
    pastParticiple: 'geholfen', level: 'A2',
    conjugation: { ich: 'helfe', du: 'hilfst', er: 'hilft', wir: 'helfen', ihr: 'helft', sie: 'helfen' },
  },
  {
    id: 'v022', infinitive: 'nehmen', en: 'to take', type: 'irregular', auxiliary: 'haben',
    pastParticiple: 'genommen', level: 'A2',
    conjugation: { ich: 'nehme', du: 'nimmst', er: 'nimmt', wir: 'nehmen', ihr: 'nehmt', sie: 'nehmen' },
  },
  {
    id: 'v023', infinitive: 'geben', en: 'to give', type: 'irregular', auxiliary: 'haben',
    pastParticiple: 'gegeben', level: 'A2',
    conjugation: { ich: 'gebe', du: 'gibst', er: 'gibt', wir: 'geben', ihr: 'gebt', sie: 'geben' },
  },
  // Modal verbs
  {
    id: 'v030', infinitive: 'können', en: 'can / to be able to', type: 'modal', auxiliary: 'haben',
    pastParticiple: 'gekonnt', level: 'A1',
    conjugation: { ich: 'kann', du: 'kannst', er: 'kann', wir: 'können', ihr: 'könnt', sie: 'können' },
  },
  {
    id: 'v031', infinitive: 'müssen', en: 'must / to have to', type: 'modal', auxiliary: 'haben',
    pastParticiple: 'gemusst', level: 'A1',
    conjugation: { ich: 'muss', du: 'musst', er: 'muss', wir: 'müssen', ihr: 'müsst', sie: 'müssen' },
  },
  {
    id: 'v032', infinitive: 'wollen', en: 'to want to', type: 'modal', auxiliary: 'haben',
    pastParticiple: 'gewollt', level: 'A1',
    conjugation: { ich: 'will', du: 'willst', er: 'will', wir: 'wollen', ihr: 'wollt', sie: 'wollen' },
  },
  {
    id: 'v033', infinitive: 'dürfen', en: 'may / to be allowed to', type: 'modal', auxiliary: 'haben',
    pastParticiple: 'gedurft', level: 'A2',
    conjugation: { ich: 'darf', du: 'darfst', er: 'darf', wir: 'dürfen', ihr: 'dürft', sie: 'dürfen' },
  },
  {
    id: 'v034', infinitive: 'sollen', en: 'should / to be supposed to', type: 'modal', auxiliary: 'haben',
    pastParticiple: 'gesollt', level: 'A2',
    conjugation: { ich: 'soll', du: 'sollst', er: 'soll', wir: 'sollen', ihr: 'sollt', sie: 'sollen' },
  },
  {
    id: 'v035', infinitive: 'mögen', en: 'to like', type: 'modal', auxiliary: 'haben',
    pastParticiple: 'gemocht', level: 'A1',
    conjugation: { ich: 'mag', du: 'magst', er: 'mag', wir: 'mögen', ihr: 'mögt', sie: 'mögen' },
  },
]

export const pronouns = ['ich', 'du', 'er', 'wir', 'ihr', 'sie']

export const pronounLabels = {
  ich: 'ich (I)',
  du: 'du (you)',
  er: 'er/sie/es (he/she/it)',
  wir: 'wir (we)',
  ihr: 'ihr (you all)',
  sie: 'sie/Sie (they/you formal)',
}
