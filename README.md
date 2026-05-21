<h1 align="center">
  <img src="public/favicon/favicon.svg" width="38" height="38" alt="" style="vertical-align:middle;margin-right:10px;" />
  Nuzlocke Overlay
</h1>

<p align="center">
  A <strong>lightweight, standalone OBS Browser Source</strong> for displaying live <strong>Nuzlocke</strong> pairings.<br>
  Supports <strong>Solo Nuzlocke</strong> (single player) and <strong>Soul Link</strong> (two players, linked pairs) runs.
</p>

<p align="center">
  <a href="https://nuzlocke-overlay.noverraz.tv" target="_blank">nuzlocke-overlay.noverraz.tv</a>
  &nbsp;·&nbsp;
  <a href="#quick-start">Quick Start</a>
  &nbsp;·&nbsp;
  <a href="#obs-setup">OBS Setup</a>
</p>

---

## Overview

Whether you are running a **Solo Nuzlocke** on your own or a **Soul Link** with a friend, this overlay shows your Pokemon pairings live on stream. It works as a **Browser Source** in OBS -- no plugins, no extra software.

Includes a **web-based setup page** where you can edit your pairings in-browser. Your data is saved in localStorage, so it persists when you come back. **Edit the text any time and the overlay updates live** -- no need to refresh or restart OBS.

The site is hosted at **[nuzlocke-overlay.noverraz.tv](https://nuzlocke-overlay.noverraz.tv)** -- just visit, type your pairings, and copy the overlay URL.

---

## Quick Start

### Online (Recommended)

Just visit the live site:

```
https://nuzlocke-overlay.noverraz.tv
```

1. Type your pairings in the YAML editor (auto-saves to localStorage)
2. Click **"Copy Overlay URL"**
3. Paste the URL into OBS as a Browser Source

No server, no installation -- everything runs in your browser.

### Local Development

```bash
node server.js
```

Then open `http://localhost:3000/` in your browser.

---

## How It Works

### Use the Web Setup Page (Recommended)

1. Open the setup page -- either [online](https://nuzlocke-overlay.noverraz.tv) or locally at `http://localhost:3000/`
2. Type your pairings in the YAML editor -- it auto-saves every keystroke
3. Click **"Copy Overlay URL"** to copy the link
4. Paste the link into OBS as a Browser Source

Your data is saved in your browser's localStorage. Come back anytime -- it will still be there.

**Live editing:** While the overlay is open in OBS, you can go back to the setup page, edit the text, and the overlay will update automatically within a few seconds. No need to refresh the browser source.

### Edit `public/run.yaml` Directly

For local development or if you prefer editing files directly, edit `public/run.yaml` and the overlay will auto-update.

---

## YAML Format

The overlay supports **two modes**, auto-detected per route:

#### Solo Nuzlocke Mode (one Pokemon per route)

```yaml
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

#### Soul Link Mode (two Pokemon per route)

```yaml
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

**Format rules:**
- **`- Route Name`:** Starts a new pairing
- **Next line:** Nicknames -- single nickname (Solo) or `Player1 & Player2` (Soul Link)
- **Next line:** Species -- single species (Solo) or `Player1 & Player2` (Soul Link)
  - **Auto-detection:** If the species line contains `&`, it is Soul Link mode. Otherwise, it is Solo mode.
- **`(DEAD)` or `(BOX)`** on a route line hides that pairing
- **`(Shiny)`** after a species shows shiny sprite for that Pokemon
- Blank lines are ignored

**Comments:** Lines starting with `#` are ignored:

```yaml
# This route is dead, keeping for reference
- Route 202 (DEAD)
Biefstuk & Kipstuk
Bidoof & Starly
```

**Mixed mode:** You can mix Solo and Soul Link routes in the same file. Each route is auto-detected independently.

---

## OBS Setup

Add a **Browser** source with:

| Setting | Value |
|---|---|
| URL | The URL you copied from the setup page |
| Width | Your stream canvas width (e.g. 1920) |
| Height | Your stream canvas height (e.g. 1080) |
| Background | Transparent |

---

## URL Parameters

| Param | Example | Effect |
|---|---|---|
| `?female=true` | `?female=true` | Shows female variant sprites |
| `?art=home` | `?art=home` | Uses PokeAPI "home" artwork instead of "official-artwork" |
| `?font=FontName` | `?font=Press+Start+2P` | Replace default font with any Google Font (spaces become `+`) |
| `?gen=1-5` | `?gen=1-5` | Use Gen 1-5 type assignments (e.g. Clefairy shows Normal instead of Fairy) |
| `?font-weight=...` | `?font=Rubik&font-weight=300;400;600;700` | Font weights to load (semicolon-separated, default `400;600;700`) |

### Generation-Aware Typing

Some Pokemon had their types changed in Generation 6 (e.g. Clefairy went from Normal to Fairy, Magnemite went from Electric to Electric/Steel). By default, the overlay uses **current (Gen 6+) typing** for the circle colors.

To use **pre-Gen-6 typing** instead, add `?gen=1-5` to your overlay URL. The overlay will look up the `past_types` data from PokeAPI and use the type assignment from Generations 1-5.

You can also select this from the **Typing** dropdown on the setup page (right of the "Load Example" button).

### Pokemon Name Normalization

The overlay automatically normalizes common name formats so you don't need to know PokeAPI's exact slug format:

| You type | PokeAPI expects |
|---|---|
| `Mr. Mime` | `mr-mime` |
| `Galarian Mr. Mime` | `mr-mime-galar` |
| `Alolan Raichu` | `raichu-alola` |
| `Hisuian Zorua` | `zorua-hisui` |
| `Paldean Wooper` | `wooper-paldea` |
| `Farfetch'd` | `farfetchd` |
| `Flabébé` | `flabebe` |
| `Type: Null` | `type-null` |
| `Nidoran♀` | `nidoran-f` |

Just type the name naturally -- the overlay handles the conversion.

### Font Customization

The overlay uses **FLURO** by default, but you can swap to any Google Font:

```
?font=Press+Start+2P
?font=Rubik&font-weight=300;400;600;700
?font=Montserrat&font-weight=400;700
```

The font is loaded dynamically via the Google Fonts CSS2 API. FLURO is always kept as a fallback.

---

## Data Source Priority

The overlay reads data from these sources, in order:

1. **localStorage** (key `nuzlocke-yaml`) -- set by the setup page (`index.html`)
2. **`/run.yaml`** -- fallback for local development

---

## Project Structure

```
nuzlocke-overlay/
├── public/
│   ├── index.html       Setup page (YAML editor, URL generator)
│   ├── overlay.html     OBS Browser Source (the overlay)
│   ├── run.yaml         Fallback pairing data for local dev
│   ├── fonts/           FLURO font files
│   └── favicon/         Site icons
├── server.js            Static file server (Node.js, zero deps)
├── package.json
├── .gitignore
└── README.md
```

---

## License

[MIT](LICENSE)

Copyright (c) 2025 Luuk Noverraz
