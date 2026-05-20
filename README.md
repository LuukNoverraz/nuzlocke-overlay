# Soullocke

**Soullocke** ([soullocke.vercel.app](https://soullocke.vercel.app)) is a tracker built specifically for tracking [soul-linked Nuzlocke](https://pastebin.com/Fg6hfDma) runs. Unlike other Nuzlocke trackers, Soullocke tracks the Pokémon across two trainers with quality of life features to help track which Pokémon are soul-linked.

![preview](/public/Preview.png)

## ⚠️ Notice

soullocke is now regularly hitting the max simultaneous connection limit. I will be looking into ways to deal with this issue, but if you want to support the project in the meantime, you can do so via [ko-fi](https://ko-fi.com/jynnie).

## ✨ Features

Overview of main features. Currently used as a checklist while the project is in development.

- Easily track where Pokémon are caught and when they are boxed, swapped into your team, defeated, etc.
- Timeline view of soul-linked trainers' teams and catches.
- Filter and search tracked Pokémon.

Future features include password lock. Please leave feature requests as an [issue](https://github.com/jynnie/soullocke/issues).

### FAQ

- Are changes saved automatically?
  - Yes! Changes are saved in real time, so you don't have to worry about losing your progress. Everyone at the link will see the same changes and can edit in real-time.
- Does this track Pokémon levels and moves?
  - No, decided against adding fine-grain tracking of these details. We're designed for simplicity. If you want that level of detail, we reccommend using a different tracker.

## 🔨 Development

Soullocke is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app); and data powered by [pokeapi.co](https://pokeapi.co/). Additional thanks to [PokéSprite](https://github.com/msikma/pokesprite) and [Nuzlocke Generator](nuzlocke-generator.herokuapp.com).

```
$ yarn install
```

Run locally:

```
$ yarn dev
$ yarn emulate
```

Dummy data is populated at [http://localhost:3000/run/nitrous-gerbil-65](http://localhost:3000/run/nitrous-gerbil-65).

## 📺 Twitch Overlay

A standalone OBS Browser Source overlay is included at `public/overlay.html`. It connects directly to the same Firebase database and displays live Soul Link pairings with real-time updates.

### Setup

1. **Start the dev server** (or deploy the project):
   ```bash
   yarn dev
   ```

2. **Create a run** in the tracker UI and note the run ID (e.g., `nitrous-gerbil-65`).

3. **Open the overlay** in your browser to test:
   ```
   http://localhost:3000/overlay.html?run=YOUR_RUN_ID
   ```

4. **Add as OBS Browser Source:**
   - In OBS, add a new **Browser** source.
   - Set the URL to: `http://localhost:3000/overlay.html?run=YOUR_RUN_ID`
   - Set Width: `1920`, Height: `400`
   - Enable "Refresh browser when scene becomes active"
   - Background: Transparent (OBS default)

### URL Parameters

| Parameter | Example | Description |
|-----------|---------|-------------|
| `run` | `?run=nitrous-gerbil-65` | **Required.** The run ID to display. |
| `admin` | `?admin=true` | Shows swap simulation buttons (hidden from viewers). |
| `shiny` | `?shiny=true` | Shows shiny Gen V sprites instead of normal. |
| `female` | `?female=true` | Shows female variant sprites. Combine with `shiny` for shiny female. |

### Testing with Dummy Data

1. Start the Firebase emulator: `yarn emulate`
2. Start the dev server: `yarn dev`
3. Open the overlay: `http://localhost:3000/overlay.html?run=nitrous-gerbil-65`
4. The dummy run has one pair: **Bulbasaur** (Ash) ↔ **Squirtle** (Misty)

### Testing Faints & Swaps

**Faints:** In the tracker UI, click on a Pokémon → "Add Event" → select "Defeated" → the overlay will update in real-time showing the pair as dead.

**Swaps:** Open the overlay with `?admin=true` to reveal admin buttons. Click "⤾ [Route Name]" to simulate a swap — a gold "⤾ Swapped" badge will appear for 10 seconds.

### Sprite Variants

The overlay uses **Gen V (Black/White) sprites** from the PokeAPI sprite repository. Configure via URL params:
- Normal: `?shiny=false&female=false` (default)
- Shiny: `?shiny=true`
- Female: `?female=true`
- Shiny Female: `?shiny=true&female=true`

### Production Deployment

When deploying to production (e.g., Vercel), the overlay will be available at:
```
https://your-domain.vercel.app/overlay.html?attempt4
```

## 🎮 Twitch Overlay (run.txt mode)

The overlay can also run **without Firebase** by reading from `public/run.txt`. This is ideal for OBS Browser Sources — just edit the text file and the overlay auto-refreshes every 3 seconds.

### How it works

1. **Edit `public/run.txt`** with your Soul Link pairings in this format:

```
ATTEMPT 4

- Route 201
Nightfall & Nightfall
Piplup & Piplup

- Route 202 (DEAD)
Biefstuk & Kipstuk
Bidoof & Starly

- Lake Verity
Royalty & Tyranny
Starly & Bidoof
```

**Format rules:**
- **Line 1:** Title (e.g. `ATTEMPT 4`) — becomes the URL slug (`attempt4`)
- **Lines starting with `- `:** Route/pairing header
- **Next non-blank line:** Nicknames — `Player1 & Player2`
- **Next non-blank line:** Species — `Player1 & Player2`
- **`(DEAD)` or `(BOX)`** on a route line → the entire pairing is **hidden** from the overlay
- Blank lines are ignored

2. **Open the overlay** in OBS as a Browser Source:
```
http://localhost:3000/overlay.html?attempt4
```
The query param (`?attempt4`) should match the slug from line 1 of `run.txt`.

3. **Edit `run.txt` live** while streaming — the overlay auto-updates every 3 seconds.

### URL Parameters

| Param | Example | Effect |
|---|---|---|
| `?slug` | `?attempt4` | Matches against the title in `run.txt` |
| `?admin=true` | `?attempt4&admin=true` | Shows swap simulation buttons |
| `?shiny=true` | `?attempt4&shiny=true` | Shows shiny sprites |
| `?female=true` | `?attempt4&female=true` | Shows female sprites |

## 📄 License

[MIT](https://github.com/jynnie/soullocke/blob/main/LICENSE) © [jynnie](https://github.com/jynnie)
