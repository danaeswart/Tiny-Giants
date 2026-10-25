<div align="center">

<img src="docs/readme-images/mockup-01-collage.png" alt="Tiny Giants: Small kids. Giant courage." width="100%" />

<br/>

# Tiny Giants

### An interactive storybook mobile app that helps children understand big feelings

**Type of solution:** Mobile app (iOS · Android · Web) built with Expo / React Native
**By:** Danae Swart

<br/>

![Expo](https://img.shields.io/badge/Expo-57-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.86-61DAFB?logo=react&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_Firestore-FFCA28?logo=firebase&logoColor=black)
![Gemini](https://img.shields.io/badge/AI-Gemini_coach-8E75B2?logo=googlegemini&logoColor=white)
![Jest](https://img.shields.io/badge/Tested_with-Jest-C21325?logo=jest&logoColor=white)

</div>

<img src="docs/readme-images/mockup-02-brand.png" alt="The Big Wave game page, app icon and tagline" width="100%" />

---

<details>
<summary><strong>Table of contents</strong></summary>

1. [About the project](#about-the-project)
2. [Built with](#built-with)
3. [Getting started](#getting-started)
4. [Features](#features)
5. [Development process](#development-process)
   - [Research and design reasoning](#research-and-design-reasoning)
6. [Final outcome](#final-outcome)
7. [Conclusion](#conclusion)
8. [License](#license)
9. [Author](#author)
10. [Acknowledgements](#acknowledgements)

</details>

---

## About the project

**Tiny Giants** is a children's emotional-learning app. Each game is a short, narrated
storybook adventure that teaches one coping skill, such as paced breathing, small-steps
thinking or noticing kind actions. Children play in landscape on an open-book shelf with
one game per page, so they are never overwhelmed with choices. A separate, PIN-protected
parent side lets grown-ups choose which games are switched on, see what their child has
played, read insights, and chat with an AI coach for ideas on how to play together.

It was built because young children often cannot name big feelings, and parents need
simple, low-pressure tools to talk about them. The first game, **The Big Wave**, teaches
stress management: a little hero walks through the woods to the beach and learns, by
blowing out her candle into the microphone and breathing with the waves, that the calm was
inside her all along.

<img src="docs/readme-images/mockup-03-library.png" alt="A parent choosing games in the child library" width="100%" />

## Built with

<p>
  <img src="https://skillicons.dev/icons?i=react,js,firebase,nodejs,cloudflare,jest,eslint,figma,git,github,vscode" alt="Tech stack icons" />
</p>

| Area | Technology |
|------|------------|
| App framework | [Expo](https://expo.dev) SDK 57, [React Native](https://reactnative.dev) 0.86, React 19 |
| Navigation | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routes in `src/app/`) |
| Language | Plain JavaScript (JSX) |
| Media | `expo-video`, `expo-audio` (narration and microphone blow detection), `expo-speech` |
| Animation / graphics | Reanimated 4, Gesture Handler, `react-native-svg` |
| Auth and data | Firebase Authentication, Cloud Firestore, AsyncStorage |
| AI coach | Google Gemini behind a Cloudflare Worker (`worker/`) |
| Type | Poppins and DM Mono (Google Fonts) |
| Testing and linting | Jest (`jest-expo`), ESLint (`eslint-config-expo`) |
| Design | Figma, custom style guide in `docs/style-guide/` |

## Getting started

This repository contains both the **app (front end)** and the **coach Worker (back end)**
in the `worker/` folder.

### Prerequisites

| Requirement | Version | Link |
|-------------|---------|------|
| Node.js | 20 or newer | https://nodejs.org |
| npm | comes with Node | |
| Expo Go app (phone) | latest | [App Store](https://apps.apple.com/app/expo-go/id982107779) · [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent) |
| Firebase project | | https://console.firebase.google.com (enable **Authentication → Email/Password** and **Firestore**) |
| Gemini API key *(only for the AI coach)* | | https://aistudio.google.com/apikey |
| Cloudflare account + Wrangler *(only to deploy the coach)* | | https://developers.cloudflare.com/workers/wrangler/ |

### How to install

1. **Clone the repository**
   ```bash
   git clone https://github.com/danaeswart/Tiny-Giants.git
   cd Tiny-Giants
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Add your environment variables.** Create a `.env` file in the project root with your
   Firebase web config (see `src/shared/services/firebase.js` for the exact names) and the
   coach URL:
   ```bash
   EXPO_PUBLIC_COACH_URL=https://tiny-giants-coach.<your-subdomain>.workers.dev
   ```
4. **Start the app**
   ```bash
   npm start
   ```
5. **Open it**
   - Phone: scan the QR code with the Camera app (iPhone) or inside Expo Go (Android).
     Both devices must be on the same Wi-Fi. If the network blocks it, use
     `npx expo start --tunnel`.
   - Browser: press `w` in the terminal.
   - Emulator: press `i` (iOS) or `a` (Android).
6. **(Optional) Set up the AI coach back end**
   ```bash
   cd worker
   npm install
   npx wrangler secret put GEMINI_API_KEY
   npx wrangler deploy
   ```
   Then put the deployed URL in `EXPO_PUBLIC_COACH_URL` above.
7. **(Optional) Deploy Firestore rules and the web build**
   ```bash
   npx firebase deploy --only firestore:rules
   npx expo export --platform web
   npx firebase deploy --only hosting
   ```

> Other useful commands: `npm run lint` · `npm test`

## Features

<img src="docs/readme-images/mockup-04-screens.png" alt="Screens from across the app" width="100%" />

### Storybook shelf (child)
An open book where each game is one two-page spread, with a large **Play** button on the
right page. Swipe or tap to turn pages. Only the games a parent has enabled appear.

<img src="docs/readme-images/feature-storybook.png" alt="Storybook shelf" width="100%" />

### Interactive story games
Narrated scenes with captions, video, drag-and-drop and tap interactions. The child blows
into the microphone to put out the candle, clears logs from the path, jumps obstacles,
builds a sandcastle and finally breathes together with the waves.

<img src="docs/readme-images/feature-game.gif" alt="Gameplay" width="100%" />

### Parent dashboard
Switch games on and off per child, see recent play history and quick stats.

<img src="docs/readme-images/feature-parent-dashboard.png" alt="Parent dashboard" width="300" />

### Insights
Plain-language summaries of the skills a child has been practising.

<img src="docs/readme-images/feature-insights.png" alt="Insights" width="300" />

### AI parent coach
Chat with a coach that suggests how to play a game together and talk about it afterwards.
The API key never touches the app: requests go through a Cloudflare Worker that checks the
parent's Firebase sign-in token.

<img src="docs/readme-images/feature-coach.png" alt="AI coach" width="300" />

### Child profiles and safe access
Multiple child profiles with avatars, plus a **parent PIN gate** so children stay on the
child side of the app.

<p>
  <img src="docs/readme-images/feature-profiles.png" alt="Child profiles" width="300" />
  <img src="docs/readme-images/feature-pin-gate.png" alt="PIN gate" width="300" />
</p>

### Games

| Game | Theme | Status |
|------|-------|--------|
| The Big Wave | Stress and big feelings | Playable |
| Kind Detective | Kindness | Coming soon |
| Memory Garden | Remembering and loss | Coming soon |

### Built for children
- No text smaller than **16px** anywhere
- Responsive from the start (child routes landscape-first, parent routes portrait)
- Very large touch targets
- Few choices on screen at a time

## Development process

### Research and design reasoning

The research behind this project, including the reasoning for the design of each game and the
studies that led to these decisions, is collected in a shared Google Drive folder:

> **Research documents:** [Open the Google Drive folder](ADD-GOOGLE-DRIVE-LINK-HERE)

### Design summary

| Moodboard | Colour palette |
|-----------|----------------|
| <img src="docs/readme-images/moodboard.png" alt="Moodboard" width="100%" /> | <img src="docs/readme-images/colour-palette.png" alt="Colour palette" width="100%" /> |

| Typography | Wireframes |
|------------|------------|
| <img src="docs/readme-images/typography.png" alt="Typography" width="100%" /> | <img src="docs/readme-images/wireframes.png" alt="Wireframes" width="100%" /> |

**Palette:** cream `#fff6e3`, night plum `#241447`, flame `#ff6b2c`, glow `#ffc933`,
wave `#14a3d9`, deep sea `#0b4c8c`, berry `#ff4f87`, forest `#22b573`.
The full style guide is in [`docs/style-guide/`](docs/style-guide/).

### User flow

<img src="docs/readme-images/user-flow.png" alt="User flow" width="100%" />

### Architecture

<img src="docs/readme-images/architecture.png" alt="Architecture diagram" width="100%" />

```
src/
  app/       Expo Router routes: thin files that point at the pages below
  child/     Child screens (landscape-locked): pages/ + components/
  adult/     Parent screens (portrait): pages/ + components/
  games/     Shared scene engine + one folder per game
  shared/    Components, data, hooks, services, theme used by both sides
worker/      Cloudflare Worker that proxies the AI coach
docs/        Style guide and README images
```

Key decisions:

- **One data door.** Everything goes through `src/shared/services/api.js`, and child
  screens only call `getEnabledGamesForChild`, so a parent's choices apply everywhere.
- **A reusable game engine.** `src/games/engine/` provides the scene player, captions,
  narration and microphone blow detection. A game is an ordered list of scenes in a
  `scenes.js` file, so a new game needs only its own folder.
- **Secrets stay server-side.** The Gemini key lives in the Worker, which checks the
  parent's Firebase token before answering.
- **Accessibility first.** All text goes through `AppText`, which never renders below 16px.

### Data model

<img src="docs/readme-images/erd.png" alt="Data diagram" width="100%" />

### Code snippet: how a game is plugged in

```js
// src/games/registry.js
import { bigWaveScenes } from './game1-big-wave/scenes.js';

const playableGames = { 'big-wave': bigWaveScenes };

export function getScenes(gameId) {
  return playableGames[gameId] ?? null; // null → "game goes here" placeholder
}
```

### Challenges and how they were solved

| Challenge | Solution |
|-----------|----------|
| Detecting a child blowing into the phone | `useBlowDetector` reads the microphone level and treats a sustained spike as a blow; nothing is recorded or sent |
| Keeping narration, captions and video in sync | `useSpokenLines` and `timing.js` drive captions from the narration |
| Keeping the AI key safe | Cloudflare Worker proxy that verifies the Firebase sign-in token |
| Keeping children out of parent screens | Parent PIN gate and separate route groups |
| Large video files | Short clips, with some video being replaced by audio and stills |

### Testing and review
Unit tests cover input validation and the persisted store (`src/__tests__/`). The UI was
reviewed with a UX lecturer and the feedback was applied.

## Final outcome

### Test coverage results

```bash
npm test
```

<img src="docs/readme-images/test-results.png" alt="Jest results" width="100%" />

### Demonstration video

> **Add your link here:** `[Watch the demo](https://...)` (aim for 5–8 minutes)

### Promotional video / deployed link *(optional)*

> **Add your link here**

<img src="docs/readme-images/outro.png" alt="Tiny Giants" width="100%" />

## Conclusion

**Highlights.** A complete, narrated first game with real interaction (microphone, drag,
tap), a parent side with an AI coach, and a reusable engine that makes the next games
quicker to build.

**Challenges.** Synchronising narration, captions and video; keeping media small enough
for mobile; and designing for a very young audience while still giving parents useful
controls.

**Future improvements**
- Finish *Kind Detective* and *Memory Garden*
- Replace the remaining video with recorded narration and final art
- Real analytics behind the parent insights
- More languages and voice options
- Offline play and a store release

## License

Copyright  2026 Danae Swart. **All rights reserved.** This code is shared for assessment
and portfolio purposes only; it may not be copied, distributed or used to create
derivative works without written permission.

## Author

**Danae Swart**
- GitHub: [@danaeswart](https://github.com/danaeswart)
- Email: 241022@virtualwindow.co.za
- LinkedIn: *add your link*

## Acknowledgements

- [Expo documentation](https://docs.expo.dev) and [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native](https://reactnative.dev), [Firebase](https://firebase.google.com/docs), [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Google Gemini](https://ai.google.dev) for the coach
- [Google Fonts](https://fonts.google.com): Poppins and DM Mono
- [skillicons.dev](https://skillicons.dev) and [shields.io](https://shields.io) for badges
- **Open Window**, for the education, facilities and the opportunity to develop this project
- **ADD LECTURER NAME**, my lecturer, for guidance, critique and feedback throughout the project, including the UX feedback that shaped the final interface
- Claude (Anthropic) as an AI coding assistant
- Feedback from my classmates
