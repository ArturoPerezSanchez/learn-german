from __future__ import annotations

import html
import json
import re
import unicodedata
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "images" / "cards" / "generated"
DATA_PATH = ROOT / "data" / "vocabulary-expanded.json"
INDEX_PATH = OUT_DIR / "index.html"

COLORS = {
    "paper": "#FFFDF7",
    "ink": "#263238",
    "mist": "#E8F1F2",
    "line": "#D7E0DF",
    "spruce": "#2F6F6D",
    "sun": "#F9C74F",
    "coral": "#F36F5B",
    "sky": "#5AA9E6",
    "leaf": "#65A765",
    "grape": "#7A6FF0",
}

CATEGORY_COLORS = {
    "food": ("#F36F5B", "#F9C74F"),
    "home": ("#5AA9E6", "#FFFDF7"),
    "family": ("#65A765", "#F9C74F"),
    "school": ("#7A6FF0", "#FFFDF7"),
    "body": ("#F4C6A6", "#5AA9E6"),
    "clothes": ("#5AA9E6", "#F36F5B"),
    "animals": ("#65A765", "#FFFDF7"),
    "nature": ("#2F6F6D", "#F9C74F"),
    "town": ("#F9C74F", "#5AA9E6"),
    "transport": ("#5AA9E6", "#65A765"),
    "time": ("#7A6FF0", "#F9C74F"),
    "verbs": ("#2F6F6D", "#FFFDF7"),
    "adjectives": ("#F36F5B", "#FFFDF7"),
    "phrases": ("#F9C74F", "#2F6F6D"),
}

PICTOGRAMS = {
    "Apfel": "🍎", "Banane": "🍌", "Brot": "🍞", "Butter": "🧈", "Käse": "🧀", "Ei": "🥚",
    "Fisch": "🐟", "Fleisch": "🥩", "Gemüse": "🥦", "Obst": "🍓", "Kartoffel": "🥔",
    "Tomate": "🍅", "Karotte": "🥕", "Gurke": "🥒", "Salat": "🥗", "Suppe": "🍲",
    "Reis": "🍚", "Nudel": "🍝", "Kuchen": "🍰", "Schokolade": "🍫", "Honig": "🍯",
    "Milch": "🥛", "Wasser": "💧", "Saft": "🧃", "Kaffee": "☕", "Tee": "🍵",
    "Salz": "🧂", "Zucker": "🍬", "Pfeffer": "🧂", "Frühstück": "🍳", "Mittagessen": "🍽️",
    "Abendessen": "🍽️", "Brötchen": "🥖", "Marmelade": "🍓", "Joghurt": "🥣",
    "Pizza": "🍕", "Löffel": "🥄", "Gabel": "🍴", "Messer": "🔪", "Teller": "🍽️",
    "Tasse": "☕", "Glas": "🥛",
    "Haus": "🏠", "Wohnung": "🏢", "Zimmer": "🚪", "Küche": "🍳", "Bad": "🛁",
    "Tür": "🚪", "Fenster": "🪟", "Tisch": "🪑", "Stuhl": "🪑", "Bett": "🛏️",
    "Sofa": "🛋️", "Schrank": "🗄️", "Lampe": "💡", "Teppich": "▭", "Spiegel": "🪞",
    "Uhr": "🕒", "Schlüssel": "🔑", "Treppe": "🪜", "Garten": "🌻", "Balkon": "🏘️",
    "Wand": "🧱", "Boden": "▰", "Decke": "⬚", "Dusche": "🚿", "Toilette": "🚽",
    "Dach": "🏠", "Keller": "📦", "Garage": "🚗", "Kühlschrank": "🧊", "Waschmaschine": "🧺",
    "Ofen": "♨️", "Herd": "🍳", "Regal": "📚", "Kissen": "🛏️", "Pflanze": "🪴",
    "Familie": "👨‍👩‍👧", "Mutter": "👩", "Vater": "👨", "Schwester": "👧", "Bruder": "👦",
    "Tochter": "👧", "Sohn": "👦", "Oma": "👵", "Opa": "👴", "Baby": "👶",
    "Kind": "🧒", "Eltern": "👪", "Tante": "👩", "Onkel": "👨", "Cousine": "👧",
    "Cousin": "👦", "Freundin": "👩", "Freund": "🙂", "Nachbarin": "🏘️", "Nachbar": "🏘️",
    "Name": "🏷️", "Adresse": "✉️", "Geburtstag": "🎂", "Geschenk": "🎁",
    "Schule": "🏫", "Klasse": "👩‍🏫", "Lehrer": "👨‍🏫", "Lehrerin": "👩‍🏫",
    "Schüler": "👦", "Schülerin": "👧", "Buch": "📖", "Heft": "📓", "Stift": "🖊️",
    "Bleistift": "✏️", "Kuli": "🖊️", "Tasche": "👜", "Rucksack": "🎒", "Pause": "⏸️",
    "Aufgabe": "📝", "Prüfung": "📋", "Frage": "❓", "Antwort": "✅", "Tafel": "🟩",
    "Papier": "📄", "Schere": "✂️", "Kleber": "🧴", "Computer": "💻", "Tablet": "📱",
    "Mappe": "📁", "Lineal": "📏", "Radiergummi": "🧽", "Note": "💯", "Wörterbuch": "📘",
    "Unterricht": "🏫",
    "Kopf": "🙂", "Auge": "👁️", "Nase": "👃", "Mund": "👄", "Ohr": "👂",
    "Hand": "✋", "Arm": "💪", "Bein": "🦵", "Fuß": "🦶", "Haar": "💇",
    "Zahn": "🦷", "Gesicht": "🙂", "Bauch": "🧍", "Rücken": "🚶", "Herz": "❤️",
    "Finger": "☝️", "Knie": "🦵", "Schulter": "🤷", "Hals": "🧣", "Stimme": "🎙️",
    "Hemd": "👔", "Hose": "👖", "Kleid": "👗", "Rock": "👗", "Jacke": "🧥",
    "Mantel": "🧥", "Schuh": "👞", "Socke": "🧦", "Hut": "🎩", "Mütze": "🧢",
    "Schal": "🧣", "Brille": "👓", "Gürtel": "◼", "Pullover": "👕", "T-Shirt": "👕",
    "Jeans": "👖",
    "Hund": "🐶", "Katze": "🐱", "Vogel": "🐦", "Pferd": "🐴", "Kuh": "🐮",
    "Schwein": "🐷", "Schaf": "🐑", "Ziege": "🐐", "Maus": "🐭", "Hase": "🐰",
    "Ente": "🦆", "Biene": "🐝", "Schmetterling": "🦋", "Frosch": "🐸", "Elefant": "🐘",
    "Löwe": "🦁",
    "Baum": "🌳", "Blume": "🌸", "Gras": "🌱", "Himmel": "☁️", "Sonne": "☀️",
    "Mond": "🌙", "Stern": "⭐", "Wolke": "☁️", "Regen": "🌧️", "Schnee": "❄️",
    "Wind": "💨", "Berg": "⛰️", "Fluss": "〰️", "See": "🌊", "Meer": "🌊",
    "Wald": "🌲", "Strand": "🏖️", "Insel": "🏝️", "Stein": "🪨", "Feuer": "🔥",
    "Stadt": "🏙️", "Dorf": "🏘️", "Straße": "🛣️", "Park": "🌳", "Bahnhof": "🚉",
    "Haltestelle": "🚏", "Brücke": "🌉", "Geschäft": "🏬", "Supermarkt": "🛒",
    "Bäckerei": "🥐", "Apotheke": "⚕️", "Krankenhaus": "🏥", "Bank": "🏦", "Hotel": "🏨",
    "Restaurant": "🍽️", "Kino": "🎬", "Museum": "🏛️", "Post": "📮", "Polizei": "👮",
    "Bibliothek": "📚", "Markt": "🛍️", "Spielplatz": "🛝",
    "Bus": "🚌", "Zug": "🚆", "Auto": "🚗", "Fahrrad": "🚲", "Taxi": "🚕",
    "Flugzeug": "✈️", "Schiff": "🚢", "U-Bahn": "🚇", "Straßenbahn": "🚊",
    "Fahrplan": "🗓️", "Fahrkarte": "🎫", "Koffer": "🧳", "Reise": "🧳", "Weg": "➡️",
    "Tag": "☀️", "Nacht": "🌙", "Morgen": "🌅", "Abend": "🌇", "Woche": "🗓️",
    "Monat": "📅", "Jahr": "📆", "Stunde": "🕐", "Minute": "⏱️", "Termin": "📌",
    "Kalender": "📅", "Zeit": "⏰", "Montag": "1", "Dienstag": "2", "Mittwoch": "3",
    "Donnerstag": "4", "Freitag": "5", "Samstag": "6", "Sonntag": "7",
    "sein": "=", "haben": "🤲", "machen": "🛠️", "gehen": "🚶", "kommen": "👋",
    "sehen": "👀", "hören": "👂", "sprechen": "💬", "sagen": "🗨️", "fragen": "❓",
    "antworten": "✅", "lernen": "📚", "lesen": "📖", "schreiben": "✍️", "rechnen": "➕",
    "spielen": "🎮", "arbeiten": "💼", "wohnen": "🏠", "leben": "🏡", "essen": "🍽️",
    "trinken": "🥛", "kochen": "🍳", "kaufen": "🛒", "bezahlen": "💳", "suchen": "🔎",
    "finden": "🎯", "brauchen": "❗", "möchten": "🙋", "können": "💪", "müssen": "!",
    "dürfen": "✅", "wollen": "🎯", "sollen": "☝️", "mögen": "❤️", "schlafen": "😴",
    "aufstehen": "🌅", "sitzen": "🪑", "stehen": "🧍", "liegen": "🛏️", "fahren": "🚗",
    "laufen": "🏃", "schwimmen": "🏊", "tanzen": "💃", "singen": "🎤", "lachen": "😄",
    "weinen": "😢", "helfen": "🤝", "geben": "🎁", "nehmen": "🤲", "bringen": "📦",
    "öffnen": "🔓", "schließen": "🔒", "warten": "⏳", "beginnen": "▶️", "enden": "⏹️",
    "verstehen": "💡", "erklären": "🧑‍🏫", "wiederholen": "🔁", "üben": "✍️",
    "reisen": "🧳", "besuchen": "🚪", "treffen": "🤝", "anrufen": "📞", "putzen": "🧽",
    "waschen": "🧼", "tragen": "📦", "zeigen": "👉", "lieben": "❤️", "denken": "💭",
    "bleiben": "📍", "fehlen": "❔", "passen": "🧩", "gefallen": "👍", "probieren": "🧪",
    "bestellen": "🧾", "buchstabieren": "🔤", "zählen": "🔢",
    "gut": "👍", "schlecht": "👎", "groß": "⬆️", "klein": "⬇️", "lang": "↔️",
    "kurz": "↔", "schnell": "⚡", "langsam": "🐢", "warm": "🌤️", "kalt": "🧊",
    "heiß": "🔥", "neu": "✨", "alt": "🕰️", "jung": "🌱", "schön": "🌟",
    "leicht": "🪶", "schwer": "🏋️", "einfach": "✅", "schwierig": "🧩", "richtig": "✅",
    "falsch": "❌", "voll": "⬛", "leer": "⬜", "laut": "🔊", "leise": "🔈",
    "sauber": "✨", "schmutzig": "🟤", "müde": "😴", "wach": "👀", "glücklich": "😊",
    "traurig": "😢", "freundlich": "🙂", "nett": "😊", "wichtig": "❗", "möglich": "✅",
    "billig": "💵", "teuer": "💎", "früh": "🌅", "spät": "🌙", "nah": "📍",
    "weit": "🧭", "dunkel": "🌑", "hell": "💡", "rot": "🔴", "blau": "🔵",
    "grün": "🟢", "gelb": "🟡", "schwarz": "⚫", "weiß": "⚪", "orange": "🟠",
    "rosa": "🌸", "braun": "🟤", "grau": "⚙️", "rund": "⭕", "eckig": "⬛",
    "weich": "🧸", "hart": "🪨", "süß": "🍬", "sauer": "🍋", "salzig": "🧂",
    "Hallo!": "👋", "Guten Morgen!": "🌅", "Guten Tag!": "☀️", "Guten Abend!": "🌇",
    "Gute Nacht!": "🌙", "Tschüss!": "👋", "Bis später!": "⏰", "Bis morgen!": "🌅",
    "Danke.": "🙏", "Danke schön.": "🙏", "Bitte.": "🙌", "Entschuldigung.": "🙇",
    "Kein Problem.": "👍", "Wie heißt du?": "🏷️", "Ich heiße ...": "🏷️",
    "Wie geht es dir?": "🙂", "Mir geht es gut.": "😊", "Ich verstehe.": "💡",
    "Ich verstehe nicht.": "❓", "Noch einmal, bitte.": "🔁", "Langsam, bitte.": "🐢",
    "Was bedeutet das?": "❓", "Wo ist ...?": "📍", "Ich komme aus ...": "🗺️",
    "Ich wohne in ...": "🏠", "Ich lerne Deutsch.": "🇩🇪", "Sprechen Sie Englisch?": "💬",
    "Ich hätte gern ...": "🙋", "Wie viel kostet das?": "💶", "Hilfe!": "🆘",
    "Viel Spaß!": "🎉", "Gute Idee!": "💡", "Sehr gut!": "🌟", "Mach weiter!": "➡️",
    "Herzlichen Glückwunsch!": "🎉", "Alles Gute!": "🎁", "Einen Moment, bitte.": "⏳",
    "Kannst du mir helfen?": "🤝", "Ich bin fertig.": "✅", "Das ist richtig.": "✅",
    "Das ist falsch.": "❌", "Ich bin dran.": "🙋", "Du bist dran.": "👉",
    "Ich mag das.": "❤️", "Ich habe Hunger.": "🍽️", "Ich habe Durst.": "🥛",
}

NOUNS = """
food|der|Apfel|apple
food|die|Banane|banana
food|das|Brot|bread
food|die|Butter|butter
food|der|Käse|cheese
food|das|Ei|egg
food|der|Fisch|fish
food|das|Fleisch|meat
food|das|Gemüse|vegetables
food|das|Obst|fruit
food|die|Kartoffel|potato
food|die|Tomate|tomato
food|die|Karotte|carrot
food|die|Gurke|cucumber
food|der|Salat|salad
food|die|Suppe|soup
food|der|Reis|rice
food|die|Nudel|noodle
food|der|Kuchen|cake
food|die|Schokolade|chocolate
food|der|Honig|honey
food|die|Milch|milk
food|das|Wasser|water
food|der|Saft|juice
food|der|Kaffee|coffee
food|der|Tee|tea
food|das|Salz|salt
food|der|Zucker|sugar
food|der|Pfeffer|pepper
food|das|Frühstück|breakfast
food|das|Mittagessen|lunch
food|das|Abendessen|dinner
food|das|Brötchen|bread roll
food|die|Marmelade|jam
food|der|Joghurt|yogurt
food|die|Pizza|pizza
food|der|Löffel|spoon
food|die|Gabel|fork
food|das|Messer|knife
food|der|Teller|plate
food|die|Tasse|cup
food|das|Glas|glass
home|das|Haus|house
home|die|Wohnung|apartment
home|das|Zimmer|room
home|die|Küche|kitchen
home|das|Bad|bathroom
home|die|Tür|door
home|das|Fenster|window
home|der|Tisch|table
home|der|Stuhl|chair
home|das|Bett|bed
home|das|Sofa|sofa
home|der|Schrank|cabinet
home|die|Lampe|lamp
home|der|Teppich|rug
home|der|Spiegel|mirror
home|die|Uhr|clock
home|der|Schlüssel|key
home|die|Treppe|stairs
home|der|Garten|garden
home|der|Balkon|balcony
home|die|Wand|wall
home|der|Boden|floor
home|die|Decke|ceiling
home|die|Dusche|shower
home|die|Toilette|toilet
home|das|Dach|roof
home|der|Keller|basement
home|die|Garage|garage
home|der|Kühlschrank|refrigerator
home|die|Waschmaschine|washing machine
home|der|Ofen|oven
home|der|Herd|stove
home|das|Regal|shelf
home|das|Kissen|pillow
home|die|Pflanze|plant
family|die|Familie|family
family|die|Mutter|mother
family|der|Vater|father
family|die|Schwester|sister
family|der|Bruder|brother
family|die|Tochter|daughter
family|der|Sohn|son
family|die|Oma|grandma
family|der|Opa|grandpa
family|das|Baby|baby
family|das|Kind|child
family|die|Eltern|parents
family|die|Tante|aunt
family|der|Onkel|uncle
family|die|Cousine|female cousin
family|der|Cousin|male cousin
family|die|Freundin|female friend
family|der|Freund|friend
family|die|Nachbarin|female neighbor
family|der|Nachbar|neighbor
family|der|Name|name
family|die|Adresse|address
family|der|Geburtstag|birthday
family|das|Geschenk|gift
school|die|Schule|school
school|die|Klasse|class
school|der|Lehrer|male teacher
school|die|Lehrerin|female teacher
school|der|Schüler|male student
school|die|Schülerin|female student
school|das|Buch|book
school|das|Heft|notebook
school|der|Stift|pen
school|der|Bleistift|pencil
school|der|Kuli|ballpoint pen
school|die|Tasche|bag
school|der|Rucksack|backpack
school|die|Pause|break
school|die|Aufgabe|task
school|die|Prüfung|exam
school|die|Frage|question
school|die|Antwort|answer
school|die|Tafel|board
school|das|Papier|paper
school|die|Schere|scissors
school|der|Kleber|glue
school|der|Computer|computer
school|das|Tablet|tablet
school|die|Mappe|folder
school|das|Lineal|ruler
school|der|Radiergummi|eraser
school|die|Note|grade
school|das|Wörterbuch|dictionary
school|der|Unterricht|lesson
body|der|Kopf|head
body|das|Auge|eye
body|die|Nase|nose
body|der|Mund|mouth
body|das|Ohr|ear
body|die|Hand|hand
body|der|Arm|arm
body|das|Bein|leg
body|der|Fuß|foot
body|das|Haar|hair
body|der|Zahn|tooth
body|das|Gesicht|face
body|der|Bauch|belly
body|der|Rücken|back
body|das|Herz|heart
body|der|Finger|finger
body|das|Knie|knee
body|die|Schulter|shoulder
body|der|Hals|neck
body|die|Stimme|voice
clothes|das|Hemd|shirt
clothes|die|Hose|pants
clothes|das|Kleid|dress
clothes|der|Rock|skirt
clothes|die|Jacke|jacket
clothes|der|Mantel|coat
clothes|der|Schuh|shoe
clothes|die|Socke|sock
clothes|der|Hut|hat
clothes|die|Mütze|cap
clothes|der|Schal|scarf
clothes|die|Brille|glasses
clothes|der|Gürtel|belt
clothes|der|Pullover|sweater
clothes|das|T-Shirt|t-shirt
clothes|die|Jeans|jeans
animals|der|Hund|dog
animals|die|Katze|cat
animals|der|Vogel|bird
animals|das|Pferd|horse
animals|die|Kuh|cow
animals|das|Schwein|pig
animals|das|Schaf|sheep
animals|die|Ziege|goat
animals|die|Maus|mouse
animals|der|Hase|rabbit
animals|die|Ente|duck
animals|die|Biene|bee
animals|der|Schmetterling|butterfly
animals|der|Frosch|frog
animals|der|Elefant|elephant
animals|der|Löwe|lion
nature|der|Baum|tree
nature|die|Blume|flower
nature|das|Gras|grass
nature|der|Himmel|sky
nature|die|Sonne|sun
nature|der|Mond|moon
nature|der|Stern|star
nature|die|Wolke|cloud
nature|der|Regen|rain
nature|der|Schnee|snow
nature|der|Wind|wind
nature|der|Berg|mountain
nature|der|Fluss|river
nature|der|See|lake
nature|das|Meer|sea
nature|der|Wald|forest
nature|der|Strand|beach
nature|die|Insel|island
nature|der|Stein|stone
nature|das|Feuer|fire
town|die|Stadt|city
town|das|Dorf|village
town|die|Straße|street
town|der|Park|park
town|der|Bahnhof|train station
town|die|Haltestelle|stop
town|die|Brücke|bridge
town|das|Geschäft|shop
town|der|Supermarkt|supermarket
town|die|Bäckerei|bakery
town|die|Apotheke|pharmacy
town|das|Krankenhaus|hospital
town|die|Bank|bank
town|das|Hotel|hotel
town|das|Restaurant|restaurant
town|das|Kino|cinema
town|das|Museum|museum
town|die|Post|post office
town|die|Polizei|police
town|die|Bibliothek|library
town|der|Markt|market
town|der|Spielplatz|playground
transport|der|Bus|bus
transport|der|Zug|train
transport|das|Auto|car
transport|das|Fahrrad|bicycle
transport|das|Taxi|taxi
transport|das|Flugzeug|airplane
transport|das|Schiff|ship
transport|die|U-Bahn|subway
transport|die|Straßenbahn|tram
transport|der|Fahrplan|timetable
transport|die|Fahrkarte|ticket
transport|der|Koffer|suitcase
transport|die|Reise|trip
transport|der|Weg|way
time|der|Tag|day
time|die|Nacht|night
time|der|Morgen|morning
time|der|Abend|evening
time|die|Woche|week
time|der|Monat|month
time|das|Jahr|year
time|die|Stunde|hour
time|die|Minute|minute
time|der|Termin|appointment
time|der|Kalender|calendar
time|die|Zeit|time
time|der|Montag|Monday
time|der|Dienstag|Tuesday
time|der|Mittwoch|Wednesday
time|der|Donnerstag|Thursday
time|der|Freitag|Friday
time|der|Samstag|Saturday
time|der|Sonntag|Sunday
"""

VERBS = """
sein|to be
haben|to have
machen|to do
gehen|to go
kommen|to come
sehen|to see
hören|to hear
sprechen|to speak
sagen|to say
fragen|to ask
antworten|to answer
lernen|to learn
lesen|to read
schreiben|to write
rechnen|to calculate
spielen|to play
arbeiten|to work
wohnen|to live
leben|to live
essen|to eat
trinken|to drink
kochen|to cook
kaufen|to buy
bezahlen|to pay
suchen|to search
finden|to find
brauchen|to need
möchten|would like
können|can
müssen|must
dürfen|may
wollen|to want
sollen|should
mögen|to like
schlafen|to sleep
aufstehen|to get up
sitzen|to sit
stehen|to stand
liegen|to lie
fahren|to ride
laufen|to run
schwimmen|to swim
tanzen|to dance
singen|to sing
lachen|to laugh
weinen|to cry
helfen|to help
geben|to give
nehmen|to take
bringen|to bring
öffnen|to open
schließen|to close
warten|to wait
beginnen|to begin
enden|to end
verstehen|to understand
erklären|to explain
wiederholen|to repeat
üben|to practice
reisen|to travel
besuchen|to visit
treffen|to meet
anrufen|to call
putzen|to clean
waschen|to wash
tragen|to carry
tragen|to wear
zeigen|to show
lieben|to love
denken|to think
bleiben|to stay
fehlen|to be missing
passen|to fit
gefallen|to please
probieren|to try
bestellen|to order
buchstabieren|to spell
zählen|to count
"""

ADJECTIVES = """
gut|good
schlecht|bad
groß|big
klein|small
lang|long
kurz|short
schnell|fast
langsam|slow
warm|warm
kalt|cold
heiß|hot
neu|new
alt|old
jung|young
schön|beautiful
leicht|light
schwer|heavy
einfach|easy
schwierig|difficult
richtig|correct
falsch|wrong
voll|full
leer|empty
laut|loud
leise|quiet
sauber|clean
schmutzig|dirty
müde|tired
wach|awake
glücklich|happy
traurig|sad
freundlich|friendly
nett|nice
wichtig|important
möglich|possible
billig|cheap
teuer|expensive
früh|early
spät|late
nah|near
weit|far
dunkel|dark
hell|bright
rot|red
blau|blue
grün|green
gelb|yellow
schwarz|black
weiß|white
orange|orange
rosa|pink
braun|brown
grau|gray
rund|round
eckig|angular
weich|soft
hart|hard
süß|sweet
sauer|sour
salzig|salty
"""

PHRASES = """
Hallo!|Hello!
Guten Morgen!|Good morning!
Guten Tag!|Good day!
Guten Abend!|Good evening!
Gute Nacht!|Good night!
Tschüss!|Bye!
Bis später!|See you later!
Bis morgen!|See you tomorrow!
Danke.|Thanks.
Danke schön.|Thank you very much.
Bitte.|Please.
Entschuldigung.|Excuse me.
Kein Problem.|No problem.
Wie heißt du?|What is your name?
Ich heiße ...|My name is ...
Wie geht es dir?|How are you?
Mir geht es gut.|I am doing well.
Ich verstehe.|I understand.
Ich verstehe nicht.|I do not understand.
Noch einmal, bitte.|One more time, please.
Langsam, bitte.|Slowly, please.
Was bedeutet das?|What does that mean?
Wo ist ...?|Where is ...?
Ich komme aus ...|I come from ...
Ich wohne in ...|I live in ...
Ich lerne Deutsch.|I am learning German.
Sprechen Sie Englisch?|Do you speak English?
Ich hätte gern ...|I would like ...
Wie viel kostet das?|How much does that cost?
Hilfe!|Help!
Viel Spaß!|Have fun!
Gute Idee!|Good idea!
Sehr gut!|Very good!
Mach weiter!|Keep going!
Herzlichen Glückwunsch!|Congratulations!
Alles Gute!|All the best!
Einen Moment, bitte.|One moment, please.
Kannst du mir helfen?|Can you help me?
Ich bin fertig.|I am finished.
Das ist richtig.|That is correct.
Das ist falsch.|That is wrong.
Ich bin dran.|It is my turn.
Du bist dran.|It is your turn.
Ich mag das.|I like that.
Ich habe Hunger.|I am hungry.
Ich habe Durst.|I am thirsty.
"""


def parse_block(block: str, expected_parts: int) -> list[list[str]]:
    rows = []
    for line in block.strip().splitlines():
        parts = [part.strip() for part in line.split("|")]
        if len(parts) != expected_parts:
            raise ValueError(f"Bad row: {line}")
        rows.append(parts)
    return rows


def slugify(text: str) -> str:
    normalized = unicodedata.normalize("NFKD", text)
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii").lower()
    ascii_text = re.sub(r"[^a-z0-9]+", "-", ascii_text).strip("-")
    return ascii_text or "card"


def level_for(index: int, part: str) -> str:
    if part == "phrase" and index > 30:
        return "A2"
    if index < 140:
        return "A1"
    if index < 260:
        return "A1-A2"
    return "A2"


def wrap_text(text: str, limit: int = 16) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if len(candidate) <= limit or not current:
            current = candidate
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines[:3]


def label_font_size(text: str) -> int:
    length = len(text)
    if length <= 12:
        return 40
    if length <= 18:
        return 34
    if length <= 26:
        return 28
    return 24


def category_symbol(category: str, primary: str, secondary: str) -> str:
    if category == "food":
        return f'<circle cx="180" cy="190" r="68" fill="{primary}" stroke="{COLORS["ink"]}" stroke-width="7"/><path d="M181 118c8-38 31-54 68-57-8 42-30 60-68 57Z" fill="{secondary}" stroke="{COLORS["ink"]}" stroke-width="6"/><path d="M180 101v39" stroke="{COLORS["ink"]}" stroke-width="8" stroke-linecap="round"/>'
    if category == "home":
        return f'<path d="M98 218 180 140l82 78v86H98Z" fill="{primary}" stroke="{COLORS["ink"]}" stroke-width="7" stroke-linejoin="round"/><path d="M81 218 180 122l99 96" fill="none" stroke="{secondary}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/><rect x="157" y="252" width="46" height="52" rx="7" fill="{COLORS["sun"]}" stroke="{COLORS["ink"]}" stroke-width="5"/>'
    if category == "family":
        return f'<circle cx="145" cy="175" r="35" fill="#F4C6A6" stroke="{COLORS["ink"]}" stroke-width="6"/><circle cx="212" cy="160" r="43" fill="#F4C6A6" stroke="{COLORS["ink"]}" stroke-width="6"/><path d="M104 300c7-60 21-88 42-88s34 28 42 88Z" fill="{primary}" stroke="{COLORS["ink"]}" stroke-width="6"/><path d="M164 312c7-74 23-112 49-112s42 38 49 112Z" fill="{secondary}" stroke="{COLORS["ink"]}" stroke-width="6"/>'
    if category == "school":
        return f'<path d="M92 152c45-23 73-10 88 10v146c-28-22-57-29-88-12Z" fill="{primary}" stroke="{COLORS["ink"]}" stroke-width="7"/><path d="M180 162c22-24 51-33 88-10v144c-31-17-60-10-88 12Z" fill="{secondary}" stroke="{COLORS["ink"]}" stroke-width="7"/><path d="M180 162v146" stroke="{COLORS["ink"]}" stroke-width="7"/>'
    if category == "body":
        return f'<circle cx="180" cy="174" r="60" fill="{primary}" stroke="{COLORS["ink"]}" stroke-width="7"/><path d="M118 308c8-62 28-94 62-94s54 32 62 94Z" fill="{secondary}" stroke="{COLORS["ink"]}" stroke-width="7"/><circle cx="160" cy="176" r="6" fill="{COLORS["ink"]}"/><circle cx="200" cy="176" r="6" fill="{COLORS["ink"]}"/><path d="M162 204c13 10 25 10 37 0" fill="none" stroke="{COLORS["ink"]}" stroke-width="6" stroke-linecap="round"/>'
    if category == "clothes":
        return f'<path d="M126 136h108l42 58-37 32-18-24v112H139V202l-18 24-37-32Z" fill="{primary}" stroke="{COLORS["ink"]}" stroke-width="7" stroke-linejoin="round"/><path d="M151 136c10 22 48 22 58 0" fill="{secondary}" stroke="{COLORS["ink"]}" stroke-width="6"/>'
    if category == "animals":
        return f'<ellipse cx="180" cy="210" rx="82" ry="64" fill="{primary}" stroke="{COLORS["ink"]}" stroke-width="7"/><circle cx="130" cy="168" r="24" fill="{secondary}" stroke="{COLORS["ink"]}" stroke-width="6"/><circle cx="230" cy="168" r="24" fill="{secondary}" stroke="{COLORS["ink"]}" stroke-width="6"/><circle cx="155" cy="206" r="7" fill="{COLORS["ink"]}"/><circle cx="205" cy="206" r="7" fill="{COLORS["ink"]}"/><path d="M174 229h12M180 230v18" stroke="{COLORS["ink"]}" stroke-width="6" stroke-linecap="round"/>'
    if category == "nature":
        return f'<path d="M180 94c54 42 92 96 92 142 0 45-40 74-92 74s-92-29-92-74c0-46 38-100 92-142Z" fill="{primary}" stroke="{COLORS["ink"]}" stroke-width="7"/><path d="M180 132v182M140 218l40 38 43-58" stroke="{secondary}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>'
    if category == "town":
        return f'<rect x="88" y="178" width="184" height="128" rx="10" fill="{primary}" stroke="{COLORS["ink"]}" stroke-width="7"/><path d="M78 178 180 112l102 66Z" fill="{secondary}" stroke="{COLORS["ink"]}" stroke-width="7" stroke-linejoin="round"/><rect x="152" y="238" width="56" height="68" rx="7" fill="{COLORS["paper"]}" stroke="{COLORS["ink"]}" stroke-width="5"/>'
    if category == "transport":
        return f'<rect x="82" y="150" width="196" height="124" rx="22" fill="{primary}" stroke="{COLORS["ink"]}" stroke-width="7"/><rect x="112" y="174" width="136" height="48" rx="10" fill="{COLORS["paper"]}" stroke="{COLORS["ink"]}" stroke-width="5"/><circle cx="125" cy="286" r="20" fill="{secondary}" stroke="{COLORS["ink"]}" stroke-width="6"/><circle cx="235" cy="286" r="20" fill="{secondary}" stroke="{COLORS["ink"]}" stroke-width="6"/>'
    if category == "time":
        return f'<circle cx="180" cy="205" r="82" fill="{primary}" stroke="{COLORS["ink"]}" stroke-width="7"/><path d="M180 205v-48M180 205l40 30" stroke="{secondary}" stroke-width="11" stroke-linecap="round"/><circle cx="180" cy="205" r="8" fill="{COLORS["ink"]}"/>'
    if category == "verbs":
        return f'<circle cx="180" cy="205" r="88" fill="{primary}" stroke="{COLORS["ink"]}" stroke-width="7"/><path d="M150 152v106l86-53Z" fill="{secondary}" stroke="{secondary}" stroke-width="6" stroke-linejoin="round"/>'
    if category == "adjectives":
        return f'<path d="M180 101 207 169l73 6-56 47 17 72-61-38-61 38 17-72-56-47 73-6Z" fill="{primary}" stroke="{COLORS["ink"]}" stroke-width="7" stroke-linejoin="round"/><circle cx="180" cy="207" r="38" fill="{secondary}" stroke="{COLORS["ink"]}" stroke-width="6"/>'
    return f'<rect x="83" y="148" width="194" height="124" rx="24" fill="{primary}" stroke="{COLORS["ink"]}" stroke-width="7"/><path d="M132 272 98 318v-46" fill="{primary}" stroke="{COLORS["ink"]}" stroke-width="7" stroke-linejoin="round"/><circle cx="141" cy="210" r="9" fill="{secondary}"/><circle cx="180" cy="210" r="9" fill="{secondary}"/><circle cx="219" cy="210" r="9" fill="{secondary}"/>'


def visual_symbol_for(item: dict) -> str:
    if item.get("word") in {"Haar", "Tisch", "Teppich", "Gürtel", "Boden", "Decke"}:
        return f"custom:{slugify(item['word'])}"
    if item["german"] == "tragen" and item["english"] == "to wear":
        return "👕"
    if item.get("word") and item["word"] in PICTOGRAMS:
        return PICTOGRAMS[item["word"]]
    if item["german"] in PICTOGRAMS:
        return PICTOGRAMS[item["german"]]
    if item["english"] in PICTOGRAMS:
        return PICTOGRAMS[item["english"]]
    return {
        "noun": "🏷️",
        "verb": "▶️",
        "adjective": "◆",
        "phrase": "💬",
    }.get(item["partOfSpeech"], "◆")


def item_visual_markup(item: dict, primary: str, secondary: str) -> str:
    word = item.get("word", "")
    if word == "Haar":
        return f'''
  <circle cx="180" cy="214" r="78" fill="#F4C6A6" stroke="{COLORS["ink"]}" stroke-width="7"/>
  <path d="M105 203c4-69 38-106 85-104 47 2 73 43 65 106-31-35-94-41-150-2Z" fill="#6B3E26" stroke="{COLORS["ink"]}" stroke-width="7" stroke-linejoin="round"/>
  <path d="M132 145c-12 46-8 88 18 126M174 127c-18 47-16 94 7 142M217 141c13 41 10 83-9 126" fill="none" stroke="#8A5A3C" stroke-width="9" stroke-linecap="round"/>
  <circle cx="154" cy="216" r="7" fill="{COLORS["ink"]}"/>
  <circle cx="206" cy="216" r="7" fill="{COLORS["ink"]}"/>
  <path d="M160 248c13 10 27 10 40 0" fill="none" stroke="{COLORS["ink"]}" stroke-width="6" stroke-linecap="round"/>
'''
    if word == "Tisch":
        return f'''
  <rect x="88" y="174" width="184" height="38" rx="10" fill="{primary}" stroke="{COLORS["ink"]}" stroke-width="7"/>
  <path d="M121 212v98M239 212v98" stroke="{COLORS["ink"]}" stroke-width="14" stroke-linecap="round"/>
'''
    if word == "Teppich":
        return f'''
  <rect x="86" y="152" width="188" height="132" rx="28" fill="{primary}" stroke="{COLORS["ink"]}" stroke-width="7"/>
  <path d="M121 180h118M121 218h118M121 256h118" stroke="{secondary}" stroke-width="10" stroke-linecap="round"/>
  <path d="M92 168h-18M92 198h-18M92 228h-18M92 258h-18M268 168h18M268 198h18M268 228h18M268 258h18" stroke="{COLORS["ink"]}" stroke-width="6" stroke-linecap="round"/>
'''
    if word == "Gürtel":
        return f'''
  <rect x="68" y="188" width="224" height="52" rx="14" fill="#6B3E26" stroke="{COLORS["ink"]}" stroke-width="7"/>
  <rect x="142" y="170" width="76" height="88" rx="10" fill="{secondary}" stroke="{COLORS["ink"]}" stroke-width="7"/>
  <rect x="162" y="192" width="36" height="44" rx="6" fill="{COLORS["paper"]}" stroke="{COLORS["ink"]}" stroke-width="5"/>
'''
    if word == "Boden":
        return f'''
  <path d="M74 286h212L244 144H116Z" fill="{primary}" stroke="{COLORS["ink"]}" stroke-width="7" stroke-linejoin="round"/>
  <path d="M116 144 74 286M180 144v142M244 144l42 142M95 215h170" stroke="{secondary}" stroke-width="7" stroke-linecap="round"/>
'''
    if word == "Decke":
        return f'''
  <rect x="72" y="122" width="216" height="62" rx="14" fill="{primary}" stroke="{COLORS["ink"]}" stroke-width="7"/>
  <path d="M100 184v82M180 184v82M260 184v82" stroke="{secondary}" stroke-width="8" stroke-linecap="round"/>
  <circle cx="180" cy="286" r="22" fill="{COLORS["sun"]}" stroke="{COLORS["ink"]}" stroke-width="6"/>
'''
    symbol = visual_symbol_for(item)
    font_size = 108 if len(symbol) <= 2 else 92
    if symbol.isdigit():
        font_size = 104
    return f'''
  <circle cx="180" cy="210" r="98" fill="{COLORS["mist"]}" stroke="{COLORS["ink"]}" stroke-width="7"/>
  <circle cx="180" cy="210" r="78" fill="{primary}" opacity="0.16"/>
  <text x="180" y="248" text-anchor="middle" fill="{COLORS["ink"]}" font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, Inter, Arial, sans-serif" font-size="{font_size}" font-weight="900">{html.escape(symbol)}</text>
'''


def card_svg(item: dict) -> str:
    primary, secondary = CATEGORY_COLORS[item["category"]]
    german = item["german"]
    english = item["english"]
    pos_label = item["partOfSpeech"].upper()
    title_lines = wrap_text(german, 18)
    english_lines = wrap_text(english, 26)
    title_size = label_font_size(german)
    title_y = 356 if len(title_lines) == 1 else 342
    title_markup = "\n".join(
        f'<text x="180" y="{title_y + idx * (title_size + 4)}" text-anchor="middle" fill="{COLORS["ink"]}" font-family="Inter, Arial, sans-serif" font-size="{title_size}" font-weight="900">{html.escape(line)}</text>'
        for idx, line in enumerate(title_lines)
    )
    english_markup = "\n".join(
        f'<text x="180" y="{420 + idx * 22}" text-anchor="middle" fill="{COLORS["spruce"]}" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="800">{html.escape(line)}</text>'
        for idx, line in enumerate(english_lines)
    )
    article_badge = ""
    if item.get("article"):
        article_badge = f'<rect x="24" y="24" width="72" height="42" rx="21" fill="{secondary}" stroke="{COLORS["ink"]}" stroke-width="5"/><text x="60" y="53" text-anchor="middle" fill="{COLORS["ink"]}" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="900">{item["article"]}</text>'
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 480" role="img" aria-labelledby="title desc">
  <title id="title">{html.escape(german)} vocabulary card</title>
  <desc id="desc">A German vocabulary card for {html.escape(german)}, meaning {html.escape(english)}.</desc>
  <rect x="10" y="10" width="340" height="460" rx="24" fill="{COLORS["paper"]}" stroke="{COLORS["ink"]}" stroke-width="8"/>
  <rect x="230" y="24" width="106" height="34" rx="17" fill="{COLORS["mist"]}" stroke="{COLORS["line"]}" stroke-width="3"/>
  <text x="283" y="47" text-anchor="middle" fill="{COLORS["spruce"]}" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="900">{html.escape(pos_label)}</text>
  {article_badge}
  {item_visual_markup(item, primary, secondary)}
  {title_markup}
  {english_markup}
</svg>
'''


def build_items() -> list[dict]:
    items: list[dict] = []
    seen: Counter[str] = Counter()

    def add(item: dict) -> None:
        base = slugify(item["german"])
        seen[base] += 1
        item["id"] = base if seen[base] == 1 else f"{base}-{seen[base]}"
        item["image"] = f"../images/cards/generated/{item['id']}.svg"
        item["level"] = level_for(len(items), item["partOfSpeech"])
        item["tags"] = [item["category"], item["partOfSpeech"], item["level"].lower()]
        if item.get("article"):
            item["tags"].append(item["article"])
        items.append(item)

    for category, article, word, english in parse_block(NOUNS, 4):
        add({
            "german": f"{article} {word}",
            "english": english,
            "article": article,
            "word": word,
            "category": category,
            "partOfSpeech": "noun",
        })
    for verb, english in parse_block(VERBS, 2):
        add({
            "german": verb,
            "english": english,
            "category": "verbs",
            "partOfSpeech": "verb",
        })
    for adjective, english in parse_block(ADJECTIVES, 2):
        add({
            "german": adjective,
            "english": english,
            "category": "adjectives",
            "partOfSpeech": "adjective",
        })
    for phrase, english in parse_block(PHRASES, 2):
        add({
            "german": phrase,
            "english": english,
            "category": "phrases",
            "partOfSpeech": "phrase",
        })
    return items


def write_index(items: list[dict]) -> None:
    figures = "\n".join(
        f'<figure><img src="{item["id"]}.svg" alt="{html.escape(item["german"])}"><figcaption>{html.escape(item["german"])}<span>{html.escape(item["english"])}</span></figcaption></figure>'
        for item in items
    )
    INDEX_PATH.write_text(f'''<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Generated German Vocabulary Cards</title>
    <style>
      body {{ margin: 0; background: #FFFDF7; color: #263238; font-family: Inter, system-ui, sans-serif; }}
      header {{ padding: 28px clamp(16px, 5vw, 56px); background: #E8F1F2; border-bottom: 1px solid #D7E0DF; }}
      h1 {{ margin: 0; font-size: clamp(30px, 5vw, 54px); }}
      p {{ margin: 10px 0 0; font-size: 17px; }}
      main {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 14px; padding: 24px clamp(16px, 5vw, 56px) 56px; }}
      figure {{ margin: 0; padding: 8px; border: 1px solid #D7E0DF; border-radius: 8px; background: white; }}
      img {{ display: block; width: 100%; aspect-ratio: 3 / 4; object-fit: contain; }}
      figcaption {{ display: grid; gap: 3px; padding: 8px 2px 2px; font-size: 13px; font-weight: 900; }}
      span {{ color: #2F6F6D; font-size: 12px; font-weight: 800; }}
    </style>
  </head>
  <body>
    <header>
      <h1>{len(items)} Generated German Cards</h1>
      <p>Open-source friendly SVG vocabulary deck generated from <code>assets/data/vocabulary-expanded.json</code>.</p>
    </header>
    <main>{figures}</main>
  </body>
</html>
''', encoding="utf-8")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    items = build_items()
    for item in items:
        item["visualCue"] = visual_symbol_for(item)
    for svg in OUT_DIR.glob("*.svg"):
        svg.unlink()
    for item in items:
        (OUT_DIR / f"{item['id']}.svg").write_text(card_svg(item), encoding="utf-8")

    by_category = Counter(item["category"] for item in items)
    by_part = Counter(item["partOfSpeech"] for item in items)
    DATA_PATH.write_text(json.dumps({
        "name": "Expanded German Vocabulary Deck",
        "generatedOn": "2026-06-25",
        "count": len(items),
        "levels": ["A1", "A1-A2", "A2"],
        "countsByCategory": dict(sorted(by_category.items())),
        "countsByPartOfSpeech": dict(sorted(by_part.items())),
        "cards": items,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_index(items)
    print(f"Generated {len(items)} vocabulary cards in {OUT_DIR}")


if __name__ == "__main__":
    main()
