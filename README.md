# Soul Link Overlay

A **standalone OBS Browser Source** for displaying live **Soul Link Nuzlocke** (two players, linked pairs) or **Solo Nuzlocke** (single player) pairings during a Twitch stream.

Reads pairing data from `public/run.yaml` and renders it as a transparent overlay with Pokémon sprites, type-colored circles, and auto-refresh.

## Quick Start

```bash
node server.js
```

Then open in OBS (or any browser):

```
http://localhost:3000/overlay.html?attempt4
```

## How It Works

### 1. Edit `public/run.yaml`

The overlay supports **two modes**, auto-detected per route:

#### Soul Link Mode (two Pokémon per route)

```yaml
ATTEMPT 4

- Route 201
Nightfall & Daybreak
Piplup (Shiny) & Piplup

- Route 202 (DEAD)
Biefstuk & Kipstuk
Bidoof & Starly

- Lake Verity
Royalty & Tyranny
Starly & Bidoof
```

#### Solo Nuzlocke Mode (one Pokémon per route)

```yaml
ATTEMPT 4

- Route 201
Nightfall
Piplup (Shiny)

- Route 202 (DEAD)
Kipstuk
Starly

- Lake Verity
Royalty
Starly
```

**Format rules:**
- **Line 1:** Title — becomes the URL slug (e.g. `"ATTEMPT 4"` → `?attempt4`)
- **`- Route Name`:** Starts a new pairing
- **Next line:** Nicknames — `Player1 & Player2` (Soul Link) or single nickname (Solo)
- **Next line:** Species — `Player1 & Player2` (Soul Link) or single species (Solo)
  - **Auto-detection:** If the species line contains `&`, it's Soul Link mode. Otherwise, it's Solo mode.
- **`(DEAD)` or `(BOX)`** on a route line → hides that pairing
- **`(Shiny)`** after a species → shows shiny sprite for that Pokémon
- Blank lines are ignored

**Comments:** Lines starting with `#` are ignored. Use them to comment out dead pairs, add notes, or temporarily disable routes:

```yaml
# This route is dead, keeping for reference
- Route 202 (DEAD)
Biefstuk & Kipstuk
Bidoof & Starly

# TODO: add Route 204 after we get there
```

Since the file uses the `.yaml` extension, VS Code natively recognizes it and **`Ctrl + /`** will automatically insert `#` for commenting.

**Mixed mode:** You can mix Soul Link and Solo routes in the same file. Each route is auto-detected independently.

### 2. Open in OBS

Add a **Browser** source with:

| Setting | Value |
|---|---|
| URL | `http://localhost:3000/overlay.html?attempt4` |
| Width | 1920 |
| Height | 400 |
| Background | Transparent |

### 3. Edit Live

Save `public/run.yaml` — the overlay auto-updates within 3 seconds.

## URL Parameters

| Param | Example | Effect |
|---|---|---|
| `?slug` | `?attempt4` | Matches against the title in `run.yaml` |
| `?admin=true` | `?attempt4&admin=true` | Shows swap simulation buttons (Soul Link pairs only) |
| `?shiny=true` | `?attempt4&shiny=true` | Global shiny override for all sprites |
| `?female=true` | `?attempt4&female=true` | Shows female variant sprites |
| `?art=home` | `?attempt4&art=home` | Uses PokeAPI "home" artwork instead of "official-artwork" |
| `?font=FontName` | `?attempt4&font=Press+Start+2P` | Replace FLURO with any Google Font (spaces → `+`) |
| `?font-weight=...` | `?attempt4&font=Rubik&font-weight=300;400;600;700` | Font weights to load (semicolon-separated, default `400;600;700`) |

### Font Customization

The overlay uses **FLURO** by default, but you can swap to any Google Font:

```
?attempt4&font=Press+Start+2P
?attempt4&font=Rubik&font-weight=300;400;600;700
?attempt4&font=Montserrat&font-weight=400;700
```

The font is loaded dynamically via the Google Fonts CSS2 API. FLURO is always kept as a fallback in case the Google Font fails to load.

## Project Structure

```
soullocke/
├── public/
│   ├── overlay.html     ← The overlay (OBS Browser Source)
│   ├── run.yaml         ← Your pairing data (edit this)
│   └── fonts/           ← FLURO font files
├── server.js            ← Static file server (Node.js, zero deps)
├── package.json         ← Just "start": "node server.js"
├── .gitignore
└── README.md
```

## License

[MIT](LICENSE)

**Original work** Copyright (c) 2021 Jessica Tang ([@jynnie](https://github.com/jynnie)) — [soullocke](https://github.com/jynnie/soullocke)

**Modifications** Copyright (c) 2025 Luuk Noverraz

This project is a fork of the original [soullocke](https://github.com/jynnie/soullocke) by Jessica Tang, stripped down to a standalone overlay and extended with solo Nuzlocke support, swap simulation, Google Font customization, `.yaml` file format with comment support, and OBS-optimized rendering.
