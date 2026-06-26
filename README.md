# 🐱 Gatorama

> Un juego de miaumoria muy felino — a delightfully feline memory matching game.

Gatorama is a cozy, animation-rich memory card game. Flip pairs of cards to
find matching cats, build streaks for combo bonuses, and clear the board as
fast as you can to earn a 3-star rating. Built with plain HTML, CSS, and
JavaScript — no frameworks, no build step.

---

## ✨ Features

- **16 cards · 8 unique cats** — Marmalade, Shadow, Cloud, Siam, Patches, Tux,
  Misty, and Cocoa. Each cat is drawn procedurally as inline SVG with its own
  colors and pattern (stripes, patches, tuxedo, points, solid).
- **Live stats** — move counter, pairs matched, active streak, and a running timer.
- **Streak system** — consecutive matches trigger animated combo banners
  (`DOUBLE!`, `TRIPLE!`, `QUAD!`, … up to `LEGENDARY!`) with bonus scoring.
- **Star rating** — finish in ≤12 moves for 3 stars, ≤18 for 2 stars.
- **Juicy feedback** — 3D card flips, float-away match animations, shake-on-miss,
  ripples, sparkles, and a confetti finale.
- **Procedural audio** — sound effects (flip, chime, miss buzz, streak arpeggio,
  victory fanfare) are synthesized live with the Web Audio API.
- **Background music** — loops a supplied MP3 track.
- **Atmospheric background** — drifting paw prints, glowing orbs, layered
  gradients, and a subtle noise/vignette overlay.
- **Polish** — responsive layout, `prefers-reduced-motion` support, and a
  sound on/off toggle.

---

## 🎮 How to play

1. Click any two cards to flip them over.
2. Match a pair and they float away with a chime.
3. Miss, and the cards shake and flip back.
4. Chain matches together to build a streak for combo bonuses.
5. Clear all 8 pairs to win — the fewer moves and less time, the higher your rating!

*(In-game instructions available in Spanish under **Cómo jugar**.)*

---

## 🧰 Tech stack

- **HTML / CSS / vanilla JavaScript** — no bundler or framework required.
- [Tailwind CSS](https://tailwindcss.com/) — loaded via CDN for utility classes.
- [Fraunces](https://fonts.google.com/specimen/Fraunces) +
  [Outfit](https://fonts.google.com/specimen/Outfit) — loaded from Google Fonts.
- **Web Audio API** — real-time synthesis of all sound effects.
- **HTML `<audio>`** — looping background music.

---

## 📁 Project structure

```
Catmory/
├── index.html            # Markup + Tailwind/Font links + script tags
├── css/
│   └── styles.css        # All custom styles, animations, and theming
├── js/
│   ├── cats.js           # CATS data + SVG generators (buildCatSVG, catSilhouetteSVG)
│   ├── audio.js          # AudioEngine: <audio> music + Web Audio SFX
│   ├── confetti.js       # ConfettiSystem (canvas particle burst on win)
│   ├── game.js           # Game state + core logic (init, flip, match, win)
│   └── main.js           # Background atmosphere, event wiring, and init
└── audio/
    └── maple-dyalla.mp3  # Background music track
```

> **Script load order matters.** Files attach to the global scope rather than
> using ES modules, so in `index.html` they must load in this order:
> `cats.js` → `audio.js` → `confetti.js` → `game.js` → `main.js`.

---

## 🚀 Getting started

Because the game plays background music and loads Tailwind from a CDN, browsers
require it to be served over **HTTP** rather than opened directly as a file.
From the project folder, run any static server, for example:

```bash
# Python 3
python -m http.server 8000

# Node (no install)
npx serve
```

Then open <http://localhost:8000> in your browser.

> Opening `index.html` directly via `file://` will block audio playback and may
> prevent the CDN stylesheet from loading. Use a local server.

---

## 🔧 Customization

| Want to change…        | Where to look                                                  |
| ---------------------- | -------------------------------------------------------------- |
| Background music       | Drop a file in `audio/`, then update the path in `js/audio.js` (`startMusic`). |
| Music volume           | `this.music.volume` in `js/audio.js`.                          |
| Sound effect volumes   | `sfxGain.gain.value` in `js/audio.js`.                         |
| The cats (colors/patterns) | The `CATS` array in `js/cats.js`.                          |
| Star-rating thresholds | `onWin()` in `js/game.js` (moves ≤ 12 / ≤ 18).                 |
| Colors / theme         | The `:root` CSS custom properties at the top of `css/styles.css`. |
| Streak banner messages | `showStreakBanner()` in `js/game.js`.                          |

---

## 📱 How to Install Gatorama (PWA)
Gatorama is a Progressive Web App (PWA). You can install it directly on your device for a native, full-screen experience without going through an app store.

For iOS (iPhone/iPad)
- Open Safari and navigate to the website. (Note: This only works in Safari).
- Tap the Share icon at the bottom of the screen (the square with an upward arrow).
- Scroll down the menu and tap Add to Home Screen.
- Confirm the name and tap Add in the top right corner.

For Android
- Open Google Chrome and navigate to the website.
- Tap the three-dot menu icon in the top right corner.
- Select Install app or Add to Home screen from the menu.
- Confirm the installation on the pop-up prompt.

For Windows / macOS (Desktop)
- Open Google Chrome or Microsoft Edge and navigate to the website.
- Look at the right side of the address bar (URL bar).
- Click the Install icon (usually a monitor with a downward arrow or a plus sign).
- Click Install on the confirmation prompt. The app will be added to your desktop or start menu.

## 📝 Notes

- The UI text is in **Spanish**.
- All graphics are rendered as inline SVG — there are no image assets to manage.
- Respects the user's `prefers-reduced-motion` setting by shortening animations.

---

## 📜 Credits

- Music: *Maple* by Dyalla.
- Fonts: [Fraunces](https://fonts.google.com/specimen/Fraunces) and
  [Outfit](https://fonts.google.com/specimen/Outfit) (Google Fonts).
- Utility classes: [Tailwind CSS](https://tailwindcss.com/).
