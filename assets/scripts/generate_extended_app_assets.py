import json
import math
import re
import shutil
from pathlib import Path
from xml.sax.saxutils import escape


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "images" / "extended"

COLORS = {
    "ink": "#263238",
    "paper": "#FFFDF7",
    "mist": "#E8F1F2",
    "spruce": "#2F6F6D",
    "sun": "#F9C74F",
    "coral": "#F36F5B",
    "sky": "#5AA9E6",
    "leaf": "#65A765",
    "grape": "#7A6FF0",
    "line": "#D7E0DF",
    "success": "#2E8B57",
    "warning": "#F2A541",
    "error": "#D85C5C",
}

PALETTE = [
    COLORS["spruce"],
    COLORS["sky"],
    COLORS["sun"],
    COLORS["coral"],
    COLORS["leaf"],
    COLORS["grape"],
]


def slug(value: str) -> str:
    value = value.lower()
    replacements = {
        "ä": "ae",
        "ö": "oe",
        "ü": "ue",
        "ß": "ss",
        "·": "-",
        " ": "-",
    }
    for src, dst in replacements.items():
        value = value.replace(src, dst)
    value = re.sub(r"[^a-z0-9-]+", "", value)
    value = re.sub(r"-+", "-", value).strip("-")
    return value or "asset"


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def svg_shell(width: int, height: int, body: str, label: str = "") -> str:
    aria = f' role="img" aria-label="{escape(label)}"' if label else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
        f'viewBox="0 0 {width} {height}"{aria}>\n'
        "  <defs>\n"
        '    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%">\n'
        '      <feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="#263238" flood-opacity=".16"/>\n'
        "    </filter>\n"
        '    <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">\n'
        '      <stop offset="0" stop-color="#FFFFFF" stop-opacity=".55"/>\n'
        '      <stop offset=".65" stop-color="#FFFFFF" stop-opacity=".08"/>\n'
        "    </linearGradient>\n"
        "  </defs>\n"
        f"{body}\n"
        "</svg>\n"
    )


def badge_svg(title: str, subtitle: str, fill: str, accent: str, symbol: str) -> str:
    safe_title = escape(title)
    safe_subtitle = escape(subtitle)
    safe_symbol = escape(symbol)
    body = f"""
  <circle cx="80" cy="80" r="61" fill="{fill}" filter="url(#shadow)"/>
  <circle cx="80" cy="80" r="50" fill="#FFFDF7" opacity=".92"/>
  <circle cx="80" cy="61" r="29" fill="{accent}" opacity=".92"/>
  <circle cx="80" cy="61" r="18" fill="url(#shine)"/>
  <text x="80" y="72" text-anchor="middle" font-family="Nunito Sans, Inter, sans-serif" font-weight="900" font-size="34" fill="#FFFDF7">{safe_symbol}</text>
  <text x="80" y="111" text-anchor="middle" font-family="Nunito Sans, Inter, sans-serif" font-weight="900" font-size="15" fill="{COLORS['ink']}">{safe_title}</text>
  <text x="80" y="129" text-anchor="middle" font-family="Nunito Sans, Inter, sans-serif" font-weight="800" font-size="10" fill="{COLORS['spruce']}">{safe_subtitle}</text>
  <path d="M31 93c22 27 76 27 98 0" fill="none" stroke="{fill}" stroke-width="7" stroke-linecap="round" opacity=".42"/>
"""
    return svg_shell(160, 160, body, f"{title} {subtitle}")


def lesson_badge_svg(level: str, unit: int, mode: str, fill: str, icon: str) -> str:
    body = f"""
  <rect x="18" y="18" width="124" height="124" rx="28" fill="#FFFDF7" filter="url(#shadow)"/>
  <path d="M32 120c19-14 44-19 72-12 17 4 31-1 40-15v49H32v-22Z" fill="{fill}" opacity=".22"/>
  <circle cx="80" cy="64" r="34" fill="{fill}"/>
  <text x="80" y="76" text-anchor="middle" font-family="Nunito Sans, Inter, sans-serif" font-weight="900" font-size="36" fill="#FFFDF7">{escape(icon)}</text>
  <text x="42" y="39" font-family="Nunito Sans, Inter, sans-serif" font-weight="900" font-size="18" fill="{COLORS['ink']}">{level}</text>
  <text x="118" y="39" text-anchor="end" font-family="Nunito Sans, Inter, sans-serif" font-weight="900" font-size="18" fill="{COLORS['spruce']}">U{unit}</text>
  <text x="80" y="126" text-anchor="middle" font-family="Nunito Sans, Inter, sans-serif" font-weight="800" font-size="12" fill="{COLORS['ink']}">{escape(mode)}</text>
"""
    return svg_shell(160, 160, body, f"{level} unit {unit} {mode}")


def chip_svg(text: str, subtitle: str, fill: str, accent: str) -> str:
    safe_text = escape(text)
    safe_subtitle = escape(subtitle)
    body = f"""
  <rect x="10" y="30" width="220" height="100" rx="26" fill="#FFFDF7" filter="url(#shadow)"/>
  <rect x="20" y="40" width="200" height="80" rx="21" fill="{fill}" opacity=".18"/>
  <circle cx="54" cy="80" r="26" fill="{accent}"/>
  <path d="M46 80h16M54 72v16" stroke="#FFFDF7" stroke-width="6" stroke-linecap="round"/>
  <text x="91" y="78" font-family="Nunito Sans, Inter, sans-serif" font-weight="900" font-size="28" fill="{COLORS['ink']}">{safe_text}</text>
  <text x="92" y="101" font-family="Nunito Sans, Inter, sans-serif" font-weight="800" font-size="14" fill="{COLORS['spruce']}">{safe_subtitle}</text>
"""
    return svg_shell(240, 160, body, f"{text} {subtitle}")


def tile_svg(text: str, category: str, fill: str, accent: str) -> str:
    safe_text = escape(text)
    safe_category = escape(category)
    font_size = 26 if len(text) <= 10 else 21 if len(text) <= 15 else 17
    body = f"""
  <rect x="10" y="22" width="220" height="116" rx="22" fill="#FFFDF7" filter="url(#shadow)"/>
  <rect x="18" y="30" width="204" height="100" rx="18" fill="{fill}" opacity=".18"/>
  <circle cx="42" cy="53" r="9" fill="{accent}"/>
  <circle cx="63" cy="53" r="6" fill="{COLORS['sun']}" opacity=".95"/>
  <text x="120" y="86" text-anchor="middle" font-family="Nunito Sans, Inter, sans-serif" font-weight="900" font-size="{font_size}" fill="{COLORS['ink']}">{safe_text}</text>
  <text x="120" y="112" text-anchor="middle" font-family="Nunito Sans, Inter, sans-serif" font-weight="800" font-size="12" fill="{COLORS['spruce']}">{safe_category}</text>
"""
    return svg_shell(240, 160, body, f"{text} {category}")


def particle_svg(index: int, fill: str, accent: str) -> str:
    angle = (index * 37) % 360
    shape = index % 6
    bits = []
    for i in range(7):
        a = math.radians(angle + i * 51)
        x = 80 + math.cos(a) * (23 + (i % 3) * 14)
        y = 80 + math.sin(a) * (22 + (i % 2) * 15)
        color = PALETTE[(index + i) % len(PALETTE)]
        if i % 3 == 0:
            bits.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{5 + i % 4}" fill="{color}" opacity=".9"/>')
        elif i % 3 == 1:
            bits.append(f'<rect x="{x-6:.1f}" y="{y-6:.1f}" width="12" height="12" rx="3" fill="{color}" transform="rotate({angle+i*17:.1f} {x:.1f} {y:.1f})" opacity=".85"/>')
        else:
            bits.append(f'<path d="M{x:.1f} {y-10:.1f}l4 7 8 1-6 5 2 8-8-4-8 4 2-8-6-5 8-1 4-7Z" fill="{color}" opacity=".88"/>')
    if shape in (0, 3):
        center = f'<path d="M80 36l12 27 29 3-22 19 7 29-26-15-26 15 7-29-22-19 29-3 12-27Z" fill="{fill}" filter="url(#shadow)"/>'
    elif shape in (1, 4):
        center = f'<circle cx="80" cy="80" r="37" fill="{fill}" filter="url(#shadow)"/><path d="M58 82l15 15 31-36" fill="none" stroke="#FFFDF7" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>'
    else:
        center = f'<path d="M42 96c11-36 21-55 38-55s27 19 38 55c-22 17-54 17-76 0Z" fill="{fill}" filter="url(#shadow)"/><circle cx="80" cy="73" r="13" fill="#FFFDF7" opacity=".75"/>'
    body = "\n".join(bits) + "\n" + center + f'\n  <circle cx="80" cy="80" r="48" fill="none" stroke="{accent}" stroke-width="5" opacity=".24"/>'
    return svg_shell(160, 160, body, f"feedback particle {index}")


def ui_accent_svg(title: str, fill: str, accent: str, variant: int) -> str:
    if variant % 3 == 0:
        body = f"""
  <rect x="18" y="36" width="444" height="88" rx="28" fill="#FFFDF7" filter="url(#shadow)"/>
  <path d="M34 92c73-40 132 20 214-8 78-27 123-24 198 7v33H34V92Z" fill="{fill}" opacity=".22"/>
  <circle cx="73" cy="80" r="27" fill="{accent}"/>
  <path d="M62 81h22M73 70v22" stroke="#FFFDF7" stroke-width="7" stroke-linecap="round"/>
  <text x="119" y="88" font-family="Nunito Sans, Inter, sans-serif" font-weight="900" font-size="24" fill="{COLORS['ink']}">{escape(title)}</text>
"""
    elif variant % 3 == 1:
        body = f"""
  <path d="M22 44h397c21 0 38 17 38 38s-17 38-38 38H22l20-38-20-38Z" fill="{fill}" filter="url(#shadow)"/>
  <circle cx="84" cy="82" r="24" fill="#FFFDF7" opacity=".94"/>
  <circle cx="84" cy="82" r="12" fill="{accent}"/>
  <text x="132" y="90" font-family="Nunito Sans, Inter, sans-serif" font-weight="900" font-size="24" fill="#FFFDF7">{escape(title)}</text>
"""
    else:
        body = f"""
  <rect x="24" y="24" width="432" height="112" rx="24" fill="#FFFDF7" filter="url(#shadow)"/>
  <rect x="38" y="38" width="404" height="84" rx="18" fill="{fill}" opacity=".16"/>
  <path d="M61 92c26-35 62-35 88 0" fill="none" stroke="{accent}" stroke-width="8" stroke-linecap="round"/>
  <path d="M331 68h78M331 92h52" stroke="{COLORS['spruce']}" stroke-width="8" stroke-linecap="round" opacity=".52"/>
  <text x="174" y="89" font-family="Nunito Sans, Inter, sans-serif" font-weight="900" font-size="24" fill="{COLORS['ink']}">{escape(title)}</text>
"""
    return svg_shell(480, 160, body, title)


def generate() -> None:
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True, exist_ok=True)

    manifest = {
        "name": "Extended German Learning App Asset Pack",
        "generatedOn": "2026-06-25",
        "format": "SVG assets generated from project design tokens",
        "categories": {},
    }

    def add_asset(category: str, asset_id: str, path: Path, use: str, tags=None):
        manifest["categories"].setdefault(category, {"count": 0, "items": []})
        manifest["categories"][category]["count"] += 1
        manifest["categories"][category]["items"].append(
            {
                "id": asset_id,
                "file": str(path.relative_to(OUT)).replace("\\", "/"),
                "recommendedUse": use,
                "tags": tags or [],
            }
        )

    achievement_themes = [
        ("First Step", "1st", "★"),
        ("Word Builder", "Vocab", "✓"),
        ("Article Ace", "Der", "D"),
        ("Verb Hero", "Verb", "V"),
        ("Sentence Maker", "Satz", "S"),
        ("Listening Star", "Audio", "♪"),
        ("Pronunciation Pro", "Speak", "●"),
        ("Grammar Guide", "Rule", "G"),
        ("Review Ready", "Cards", "R"),
        ("Streak Spark", "Daily", "7"),
        ("Quiz Champ", "Quiz", "Q"),
        ("Perfect Round", "100%", "!"),
        ("A1 Explorer", "A1", "A1"),
        ("A2 Explorer", "A2", "A2"),
        ("Family Learner", "Team", "♥"),
        ("Fast Recall", "Speed", "↻"),
        ("Careful Reader", "Read", "□"),
        ("Hint Helper", "Hint", "?"),
        ("Memory Match", "Pair", "∞"),
        ("Level Complete", "Done", "✦"),
    ]
    ranks = [
        ("bronze", COLORS["coral"], COLORS["sun"]),
        ("silver", COLORS["sky"], COLORS["spruce"]),
        ("gold", COLORS["sun"], COLORS["coral"]),
        ("green", COLORS["leaf"], COLORS["spruce"]),
        ("purple", COLORS["grape"], COLORS["sky"]),
    ]
    for title, subtitle, symbol in achievement_themes:
        for rank, fill, accent in ranks:
            asset_id = f"{slug(title)}-{rank}"
            path = OUT / "achievements" / f"{asset_id}.svg"
            write(path, badge_svg(title, rank.title(), fill, accent, symbol))
            add_asset("achievements", asset_id, path, f"{title} achievement badge.", [rank, subtitle])

    modes = [
        ("Flashcards", "▣"),
        ("Nouns", "N"),
        ("Adjectives", "◆"),
        ("Matching", "∞"),
        ("Articles", "D"),
        ("Verbs", "V"),
    ]
    for level in ["A1", "A2"]:
        for unit in range(1, 9):
            for idx, (mode, icon) in enumerate(modes):
                fill = PALETTE[(unit + idx + (0 if level == "A1" else 2)) % len(PALETTE)]
                path = OUT / "lesson-badges" / f"{level.lower()}-unit-{unit:02d}-{slug(mode)}.svg"
                write(path, lesson_badge_svg(level, unit, mode, fill, icon))
                add_asset("lessonBadges", path.stem, path, f"{level} unit {unit} {mode} badge.", [level, mode])

    article_specs = [
        ("der", "masculine", COLORS["sky"], COLORS["spruce"]),
        ("die", "feminine", COLORS["coral"], COLORS["grape"]),
        ("das", "neuter", COLORS["sun"], COLORS["leaf"]),
    ]
    variants = ["plain", "soft", "bold", "quiz", "card", "glow", "mini", "stamp"]
    for article, desc, fill, accent in article_specs:
        for variant in variants:
            path = OUT / "grammar" / "articles" / f"{article}-{variant}.svg"
            write(path, chip_svg(article, f"{desc} · {variant}", fill, accent))
            add_asset("grammarArticleBadges", path.stem, path, f"{article} article helper badge.", [article, desc, variant])

    cases = ["Nominativ", "Akkusativ", "Dativ", "Genitiv"]
    case_subtitles = ["subject", "direct object", "indirect object", "possessive"]
    for idx, case in enumerate(cases):
        for variant in range(1, 7):
            fill = PALETTE[(idx + variant) % len(PALETTE)]
            accent = PALETTE[(idx + variant + 2) % len(PALETTE)]
            path = OUT / "grammar" / "cases" / f"{slug(case)}-{variant:02d}.svg"
            write(path, chip_svg(case, case_subtitles[idx], fill, accent))
            add_asset("grammarCaseBadges", path.stem, path, f"{case} case helper badge.", [case])

    pronouns = [
        ("ich", "I"),
        ("du", "you"),
        ("er", "he"),
        ("sie", "she"),
        ("es", "it"),
        ("wir", "we"),
        ("ihr", "you all"),
        ("sie", "they"),
        ("Sie", "formal"),
    ]
    for idx, (pronoun, meaning) in enumerate(pronouns):
        for variant in range(1, 5):
            fill = PALETTE[(idx + variant) % len(PALETTE)]
            accent = PALETTE[(idx + variant + 3) % len(PALETTE)]
            path = OUT / "grammar" / "pronouns" / f"{slug(pronoun)}-{slug(meaning)}-{variant:02d}.svg"
            write(path, chip_svg(pronoun, meaning, fill, accent))
            add_asset("pronounChips", path.stem, path, f"Pronoun chip for {pronoun}.", [pronoun, meaning])

    words = [
        ("ich", "pronoun"), ("du", "pronoun"), ("wir", "pronoun"), ("sie", "pronoun"),
        ("bin", "verb"), ("bist", "verb"), ("ist", "verb"), ("sind", "verb"),
        ("habe", "verb"), ("hast", "verb"), ("hat", "verb"), ("haben", "verb"),
        ("gehe", "verb"), ("gehst", "verb"), ("geht", "verb"), ("gehen", "verb"),
        ("lerne", "verb"), ("lernst", "verb"), ("lernt", "verb"), ("lernen", "verb"),
        ("der", "article"), ("die", "article"), ("das", "article"), ("ein", "article"),
        ("eine", "article"), ("mein", "possessive"), ("meine", "possessive"), ("dein", "possessive"),
        ("Haus", "noun"), ("Buch", "noun"), ("Apfel", "noun"), ("Wasser", "noun"),
        ("Schule", "noun"), ("Familie", "noun"), ("Freund", "noun"), ("Stadt", "noun"),
        ("heute", "time"), ("morgen", "time"), ("jetzt", "time"), ("später", "time"),
        ("gut", "adjective"), ("groß", "adjective"), ("klein", "adjective"), ("neu", "adjective"),
        ("alt", "adjective"), ("schnell", "adjective"), ("langsam", "adjective"), ("schön", "adjective"),
        ("in", "preposition"), ("auf", "preposition"), ("mit", "preposition"), ("zu", "preposition"),
        ("nach", "preposition"), ("von", "preposition"), ("für", "preposition"), ("ohne", "preposition"),
        ("und", "connector"), ("oder", "connector"), ("aber", "connector"), ("weil", "connector"),
        ("bitte", "phrase"), ("danke", "phrase"), ("hallo", "phrase"), ("tschüss", "phrase"),
        ("ja", "answer"), ("nein", "answer"), ("richtig", "feedback"), ("falsch", "feedback"),
    ]
    expanded_words = []
    for round_idx in range(2):
        for word, category in words:
            expanded_words.append((word, category, round_idx + 1))
    for idx, (word, category, round_idx) in enumerate(expanded_words):
        fill = PALETTE[idx % len(PALETTE)]
        accent = PALETTE[(idx + 2) % len(PALETTE)]
        path = OUT / "sentence-tiles" / f"{slug(word)}-{slug(category)}-{round_idx:02d}.svg"
        write(path, tile_svg(word, category, fill, accent))
        add_asset("sentenceTiles", path.stem, path, f"Sentence builder tile for {word}.", [category])

    for idx in range(1, 81):
        fill = PALETTE[idx % len(PALETTE)]
        accent = PALETTE[(idx + 3) % len(PALETTE)]
        path = OUT / "feedback-particles" / f"particle-{idx:03d}.svg"
        write(path, particle_svg(idx, fill, accent))
        add_asset("feedbackParticles", path.stem, path, "Small celebration, success, or transition particle.", ["particle"])

    sections = [
        "Vocabulary", "Grammar", "Listening", "Speaking", "Review", "Daily Goal",
        "Streak", "Lesson Complete", "Try Again", "Perfect Round", "A1 Path", "A2 Path",
    ]
    for idx, title in enumerate(sections):
        for variant in range(1, 4):
            fill = PALETTE[(idx + variant) % len(PALETTE)]
            accent = PALETTE[(idx + variant + 2) % len(PALETTE)]
            path = OUT / "ui-accents" / f"{slug(title)}-{variant:02d}.svg"
            write(path, ui_accent_svg(title, fill, accent, variant))
            add_asset("uiAccents", path.stem, path, f"{title} section or card accent.", [title])

    total = sum(category["count"] for category in manifest["categories"].values())
    manifest["totalCount"] = total
    write(OUT / "extended-assets-manifest.json", json.dumps(manifest, indent=2, ensure_ascii=False))

    lines = [
        "<!doctype html>",
        '<html lang="en">',
        "<head>",
        '  <meta charset="utf-8">',
        '  <meta name="viewport" content="width=device-width, initial-scale=1">',
        "  <title>Extended Asset Pack Preview</title>",
        "  <style>",
        "    body{margin:0;background:#f7f3ec;color:#263238;font-family:Inter,Nunito Sans,system-ui,sans-serif}",
        "    main{width:min(1180px,calc(100vw - 32px));margin:0 auto;padding:28px 0 44px}",
        "    h1{font-size:clamp(1.5rem,2.5vw,2.4rem);margin:0 0 8px}",
        "    p{margin:0 0 22px;color:#58706f}",
        "    section{margin:28px 0}",
        "    h2{font-size:1rem;letter-spacing:.08em;text-transform:uppercase;color:#2F6F6D}",
        "    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(124px,1fr));gap:12px}",
        "    .card{background:#FFFDF7;border:1px solid #D7E0DF;border-radius:8px;padding:10px;min-height:152px;display:grid;place-items:center;box-shadow:0 8px 18px rgb(38 50 56 / .08)}",
        "    img{max-width:112px;max-height:112px}",
        "    small{display:block;width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:center;color:#637675}",
        "  </style>",
        "</head>",
        "<body><main>",
        f"  <h1>Extended Asset Pack</h1><p>{total} generated SVG assets for achievements, lessons, grammar, sentence building, feedback particles, and UI accents.</p>",
    ]
    for category, data in manifest["categories"].items():
        lines.append(f"  <section><h2>{escape(category)} · {data['count']}</h2><div class=\"grid\">")
        for item in data["items"][:72]:
            file = escape(item["file"])
            item_id = escape(item["id"])
            lines.append(f'    <div class="card"><img src="{file}" alt=""><small>{item_id}</small></div>')
        lines.append("  </div></section>")
    lines.append("</main></body></html>")
    write(OUT / "index.html", "\n".join(lines) + "\n")

    readme = f"""# Extended App Assets

This generated pack contains {total} lightweight SVG assets for common German learning app UI needs.

## Preview

Open `index.html` to browse the pack.

## Categories

"""
    for category, data in manifest["categories"].items():
        readme += f"- `{category}` - {data['count']} assets\n"
    readme += """
## Regeneration

Run:

```powershell
python assets/scripts/generate_extended_app_assets.py
```

The generator uses project design tokens and writes deterministic SVG assets under `assets/images/extended/`.
"""
    write(OUT / "README.md", readme)

    print(f"Generated {total} assets in {OUT}")


if __name__ == "__main__":
    generate()
