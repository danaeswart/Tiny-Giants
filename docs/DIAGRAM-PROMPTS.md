# Diagram prompts for Tiny Giants

Paste these into Claude (claude.ai works well, with "Create files" or artifacts turned on) to get
presentation ready PDF diagrams. Save each result into `docs/diagrams/` using the file name shown.

## How to use

1. Start a **new chat** and paste the **Shared context** block below first. Claude will keep it for the whole chat.
2. Then paste one **diagram prompt** at a time.
3. If you attach the project's `README.md` as well, the diagrams will be more accurate.
4. If a diagram looks cramped, reply: "Make it landscape A4, increase the font size and give the boxes more space."
5. To get a PDF every time, each prompt already ends with the export instruction.

---

## Shared context (paste this first)

```
I am presenting my mobile app project "Tiny Giants" and I need clean, professional diagrams as PDF files.

ABOUT THE APP
Tiny Giants is a children's emotional learning storybook app (tagline: "Small kids. Giant courage.").
Children aged 4 to 5 play short narrated story games that teach coping skills. The first game,
"The Big Wave", teaches stress management (paced breathing, small steps thinking). A parent side
(portrait, behind a 4 digit PIN) lets grown ups choose which games each child can see, review play
history and insights, and chat with an AI coach. The child side is landscape only.

TECH STACK
- Expo SDK 58, React Native 0.88, React 19, plain JavaScript (JSX)
- Expo Router (file based routes, Stack.Protected for auth guard)
- Reanimated 4, Gesture Handler, react-native-svg
- expo-video (silent clips), expo-audio (microphone loudness metering only, there is no voiceover or sound), expo-crypto, expo-screen-orientation
- Firebase Authentication (email and password) and Cloud Firestore with security rules
- AsyncStorage for device settings and "current child"
- Cloudflare Worker (uses the "jose" library) that verifies the Firebase ID token and calls the Google Gemini API; the Gemini key is a Worker secret
- Firebase Hosting for the web build
- Jest (jest-expo) and ESLint
- Figma for design

CODE STRUCTURE (src/)
- app/ : thin Expo Router route files (welcome, login, signup, create-pin, add-child, index, child/*, adult/*)
- child/ : pages (StorybookShelf which is now the child home "Hi, Name!" with an All games button, AllGamesView, GameIntro, PlayGame, GameNotice) and components (FloatingAvatars, PlayButton, RotatePrompt, ChildScreen, ChildMessage). The old open-book view is no longer used, do not draw a book.
- adult/ : pages (Dashboard, Games, GameDetail, Insights, InsightDetail, PlayHistory, Settings, EditChild, AccountSettings) and components (ParentPinGate, CoachChat, GameCard, StatBar, InsightCard, AuthForm, AvatarPicker, DangerZone, etc.)
- games/ : registry.js (game id to scene list), engine/ (ScenePlayer, Stage, StoryScene, SpokenStillScene, ZoomStillScene, VideoScene, SpokenVideoScene, LoopingVideoScene, BreathingVideoScene, Captions, Narration, timing.js, useSpokenLines, useBlowDetector), game1-big-wave/ (scenes.js with 18 scenes, art/ SVG drawings, BlowCandleGame)
- shared/ : components (AppText, Button, Icon, Modal, Popup, Avatar, Blobs...), data (games, avatars, insights, sessions), hooks (useAuth, useProfiles, useChildGames, useCurrentChildId, useSettings, useLoad), services (api.js "the one data door", auth, pin, coach, demo, onboarding, firebase), state/persistedStore, theme.js
- worker/ : Cloudflare Worker for the AI coach

DATA MODEL (Firestore)
parents/{uid}: name, email, pinHash, pinSalt
parents/{uid}/children/{childId}: name, age, avatar, birthday, joinedDate, enabledGameIds[], createdAt
parents/{uid}/children/{childId}/sessions/{sessionId}: gameId, completed, durationSeconds, playedAt
Game catalogue (games.js), insights (insights.js) and scenes (scenes.js) live in code, not Firestore.

VISUAL STYLE FOR ALL DIAGRAMS
- Landscape A4, white or warm cream (#fff6e3) background, generous spacing, no overlapping lines
- Palette: night plum #241447 for text and lines, flame orange #ff6b2c, glow yellow #ffc933, wave blue #14a3d9, deep sea #0b4c8c, berry pink #ff4f87, forest green #22b573
- Rounded boxes, clear arrows with labels, a legend where colours mean something
- Font: clean sans serif (Poppins style), minimum 12pt so it is readable when projected
- A short title at the top and "Tiny Giants" small in a corner
- Do not use em dashes or en dashes anywhere in the text
- Group related items in coloured swimlanes or containers

Reply "Ready" and wait for my first diagram request.
```

---

## Diagram prompts

### 01. System architecture  (`01-system-architecture.pdf`)

```
Create a system architecture diagram as a PDF (landscape A4).

Show four zones: "Device (iOS, Android, Web)", "Google Firebase", "Cloudflare" and "Google Gemini".
- Device contains: the Tiny Giants app (Expo + React Native), AsyncStorage (settings, current child), and the microphone (label: "loudness only, never stored").
- Firebase contains: Authentication, Cloud Firestore with security rules, and Hosting (web build).
- Cloudflare contains: the Coach Worker.
- Gemini is the external AI API.

Arrows with labels:
1. App to Authentication: sign up / sign in
2. Authentication to App: ID token (JWT)
3. App to Firestore: read and write own data only
4. App to Coach Worker: chat + Bearer token
5. Worker to Authentication: verify token with Google public keys
6. Worker to Gemini: prompt + secret API key
7. Gemini back to Worker back to App: reply
8. Hosting serves the web build to the App

Add a small legend: solid arrow = request, dashed arrow = token or response. Highlight in a different colour the line "API key never leaves the Worker". Export as a PDF.
```

### 02. Layered code architecture  (`02-layered-architecture.pdf`)

```
Create a layered architecture diagram as a PDF (landscape A4), drawn as horizontal layers stacked top to bottom with arrows only pointing downward.

Layers:
1. Routes: src/app (thin Expo Router files, Stack.Protected guard)
2. Screens: child/pages and adult/pages
3. UI building blocks: child/components, adult/components, shared/components (AppText, Button, Icon, Modal, Popup)
4. Logic: shared/hooks (useAuth, useProfiles, useChildGames, useSettings), games/engine, games/game1-big-wave
5. Services and data: services/api.js (highlight as "THE ONE DATA DOOR"), auth, pin, coach, demo, onboarding, data/*.js, state/persistedStore
6. External: Firebase Auth, Firestore, Cloudflare Coach Worker, AsyncStorage

Add a callout beside the diagram: "Rule: each layer only talks to the layer below. Screens never touch Firebase directly." Colour each layer differently. Export as a PDF.
```

### 03. Entity relationship diagram  (`03-erd.pdf`)

```
Create a professional ER diagram as a PDF (landscape A4) using crow's foot notation.

Entities and attributes (mark PK and FK):
- PARENT: uid (PK, Firebase Auth uid), name, email, pinHash, pinSalt
- CHILD: childId (PK), parentUid (FK, implied by path), name, age (1 to 17), avatar, birthday, joinedDate, enabledGameIds (array), createdAt
- SESSION: sessionId (PK), childId (FK, implied by path), gameId (FK), completed (bool), durationSeconds (0 to 36000), playedAt (server timestamp)
- GAME (static catalogue in code): id (PK), title, category, blurb, tools[], words[], teaches, coachNotes, parentNote, comingSoon
- INSIGHT (sample data in code): id (PK), childId (FK), gameId (FK), date, summary, observed, activitySuggestion, aiDisclaimer
- SCENE (static, in code): id (PK), gameId (FK), type (story, still, video, game), title

Relationships:
- PARENT 1 to many CHILD (has)
- CHILD 1 to many SESSION (plays)
- GAME 1 to many SESSION (is played in)
- CHILD many to many GAME via enabledGameIds (parent enables)
- CHILD 1 to many INSIGHT
- GAME 1 to many INSIGHT
- GAME 1 to many SCENE

Colour coding: entities stored in Firestore in blue (wave), entities that live in code in yellow (glow). Add a legend for this and a note: "Firestore path: parents/{uid}/children/{childId}/sessions/{sessionId}". Export as a PDF.
```

### 04. Use case diagram  (`04-use-cases.pdf`)

```
Create a UML use case diagram as a PDF (landscape A4).

Actors: Parent (left), Child (right), "Coach Worker + Gemini" (bottom right, external system), "Firebase" (bottom left, external system).

Draw a system boundary box titled "Tiny Giants" containing these use cases (ovals), grouped by package:
- Account: Sign up, Log in, Use demo account, Create parent PIN, Edit account, Delete account
- Child profiles: Add child, Edit child, Choose character
- Game control: Browse and search games, Enable or disable game per child, Enter PIN to reach parent side
- Insight: View dashboard, View play history, Read insights, Chat with AI coach
- Play: Browse All games, Search enabled games, Play a story game

Relationships:
- Parent connects to all Account, Child profiles, Game control and Insight use cases
- Child connects to Play use cases
- "Play a story game" has <<include>> to "Blow into microphone" and "Drag, tap and breathe interactions", and <<include>> to "Save play session"
- "Chat with AI coach" connects to the Coach Worker + Gemini actor
- Account use cases connect to the Firebase actor
- "Enable or disable game per child" <<extend>>s "Browse and search games"

Use correct UML notation and keep lines from crossing where possible. Export as a PDF.
```

### 05. User flow  (`05-user-flow.pdf`)

```
Create a user flow diagram as a PDF (landscape A4) with two swimlanes: "Parent (portrait)" and "Child (landscape)".

Parent lane: Open app -> Welcome -> (Sign up or Log in or Demo) -> decision "Has PIN?" (no: Create PIN) -> decision "Has a child?" (no: Add child, or skip) -> Dashboard -> Games tab -> Game detail -> Toggle game on for a child -> Play history / Insights / AI coach -> Settings (edit child, account, delete account).

Child lane: the PIN is not needed to go to the child side, but is required to return to the parent side. Show: Parent hands over device -> Child home ("Hi, Name!") -> All games -> Pick a picture tile -> Game intro -> Tap Play -> Story scenes (watch, blow, drag, tap, breathe) -> Celebration popup -> Back to game page -> (Exit) -> PIN gate -> back to Parent lane.

Add a cross lane arrow showing: "Session saved to Firestore" when the child finishes or leaves after 5 seconds, and "Game appears on the child home" when the parent enables a game. Use rounded rectangles for screens, diamonds for decisions, a different colour for each lane. Export as a PDF.
```

### 06. Sitemap and navigation  (`06-sitemap.pdf`)

```
Create a sitemap / navigation tree diagram as a PDF (landscape A4) for the Expo Router structure.

Root: _layout.jsx
Branch "Signed out (Stack.Protected guard = !user)": /welcome, /login, /signup
Branch "Signed in (Stack.Protected guard = !!user)": 
  - / (index: decides where to go: create-pin, add-child, or adult)
  - /create-pin
  - /add-child
  - /child (landscape): child home at /child, /child/games, /child/games/[gameId] (intro), /child/games/[gameId]/play, /child/story
  - /adult (portrait): bottom tabs (Dashboard, Games, Insights, Settings), plus /adult/game/[gameId], /adult/insight/[insightId], /adult/child/[childId], /adult/account, /adult/play-history

Colour code: auth screens in berry, onboarding in glow, child routes in wave blue, parent routes in forest green. Add small orientation icons (landscape or portrait) beside the child and adult branches and a note "Orientation is chosen from the first URL segment". Export as a PDF.
```

### 07. Component hierarchy  (`07-component-tree.pdf`)

```
Create a component tree diagram as a PDF (landscape A4) showing how React components compose, as two trees side by side.

LEFT TREE (Child side):
ChildLayout (landscape lock + RotatePrompt) -> StorybookShelf (child home), AllGamesView, GameIntro, PlayGame
StorybookShelf -> FloatingAvatars, Button "All games", ProfileMenu
AllGamesView -> CoverImage tiles
GameIntro -> FullCover, Play button
PlayGame -> ScenePlayer, Popup (celebration)
ScenePlayer -> Stage context -> current Scene

RIGHT TREE (Parent side):
AdultLayout -> ParentPinGate -> Bottom tabs
Tabs -> Dashboard, Games, Insights, Settings
Dashboard -> ChildTitleDropdown, StatBar, PlayedGameRow
Games -> SearchBar, CategoryFilter, GameCard -> GameDetail -> ActiveToggle, CoachChat
Insights -> InsightCard -> InsightDetail -> AiInsightBlock, ActivitySuggestionCard
Settings -> AccountRow, AvatarPicker, DangerZone

BOTTOM STRIP: "Shared building blocks used by both sides": AppText (16px minimum), Button, IconButton, Icon, Modal, Popup, Avatar, Blobs, CoverImage.
Draw dashed lines from the tree nodes that use shared components down to the strip. Export as a PDF.
```

### 08. Game engine  (`08-game-engine.pdf`)

```
Create a diagram explaining the reusable game engine as a PDF (landscape A4).

Left: "registry.js" mapping game id 'big-wave' to bigWaveScenes (and 'kind-detective' to "placeholder").
Centre: ScenePlayer with: current scene index, Stage context (width, height), close button, optional skip buttons, fade between scenes. Show the contract: "Every Scene receives one prop: onDone()". Show ScenePlayer guard: "Ignore onDone from a scene that is no longer current".
Right: a column of scene types: StoryScene, SpokenStillScene, ZoomStillScene, VideoScene, SpokenVideoScene, LoopingVideoScene, BreathingVideoScene, and Game scenes (BlowCandleGame, drag, tap).
Bottom: helper modules: Captions, Narration (timer clock, no audio), useSpokenLines, timing.js (timeLines, lineAt, estimatedEnd), useBlowDetector (microphone level 0 to 1), FitImage, NextButton.

Include a small state diagram: Scene 0 -> Scene 1 -> ... -> Last -> onFinish (save completed session); close button -> onExit (save early session if 5 seconds or more). Add a callout: "To add a game: new folder + scenes list + one line in registry". Export as a PDF.
```

### 09. Sequence: play a game and save a session  (`09-seq-play-session.pdf`)

```
Create a UML sequence diagram as a PDF (landscape A4).

Participants: Child, GameIntro, PlayGame, registry.js, ScenePlayer, Scene, api.js, Firestore.

Messages in order:
1. Child taps Play on GameIntro
2. GameIntro navigates to /child/games/big-wave/play (PlayGame)
3. PlayGame calls api.getEnabledGameForChild(childId, gameId); api.js reads Firestore; returns the game or null
4. PlayGame calls registry.getScenes('big-wave') and gets the ordered scene list
5. PlayGame renders ScenePlayer with scenes, onExit, onFinish
6. Loop for each scene: ScenePlayer renders Scene; Scene calls onDone() when narration, video or mini game ends
7. Alt fragment: [finished] ScenePlayer calls onFinish -> PlayGame calls api.recordSession(completed = true); [left early after 5 seconds or more] onExit -> recordSession(completed = false); [left before 5 seconds] nothing is saved
8. api.js calls addDoc on parents/{uid}/children/{childId}/sessions with gameId, completed, durationSeconds, playedAt = serverTimestamp
9. Note: "A failed save is only logged, the child is never interrupted"

Use activation bars and a note about Firestore rules (create allowed, update denied). Export as a PDF.
```

### 10. Sequence: AI coach  (`10-seq-ai-coach.pdf`)

```
Create a UML sequence diagram as a PDF (landscape A4) for the AI coach.

Participants: Parent, CoachChat, coach.js, Firebase Auth, Cloudflare Worker, Gemini API.

Messages:
1. Parent opens the coach on a game detail page
2. CoachChat calls askCoach({ game, child, plays, messages })
3. coach.js asks Firebase Auth for getIdToken() and receives a JWT
4. coach.js POSTs game, child (name, age), plays and messages with header Authorization: Bearer JWT to the Worker
5. Worker verifies the JWT (jwtVerify against Google's public keys, checks issuer and audience)
6. Alt: [invalid token] Worker returns 401 "Sign in again"; [valid] continue
7. Worker cleans and clips the input (last 20 messages, 2000 characters each), builds the system prompt plus a <context> block
8. Worker calls Gemini model 1 with its secret API key (20 second timeout)
9. Alt: [model missing or busy: 400, 404, 503] Worker retries with model 2; [429] returns "coach is busy"
10. Gemini returns text; Worker returns { reply }; CoachChat shows it to the Parent

Annotate with a red lock icon: "API key exists only inside the Worker". Export as a PDF.
```

### 11. Security model  (`11-security.pdf`)

```
Create a "defence in depth" security diagram as a PDF (landscape A4).

Show concentric rings or stacked shields from outside to inside, each labelled with the control and the threat it stops:
1. Firebase Authentication (email + password, validation, friendly errors) stops anonymous access
2. Auth held in memory only: every launch starts signed out (shared family device)
3. Parent PIN gate: 4 digits, salted SHA-256 hash, 5 wrong tries locks for 30 seconds: keeps children out of parent screens
4. Firestore security rules: request.auth.uid == uid, field whitelists (hasOnly), size and range checks, sessions create only (no update): stops other families reading or tampering
5. Cloudflare Worker: verifies Firebase JWT before using the AI: stops strangers abusing the AI
6. Secrets: Gemini key stored as a Worker secret, never in the app: stops key theft
7. Prompt hygiene: <context> tags, clipped fields, narrow system prompt, not a therapist: limits prompt injection and unsafe advice
8. Microphone privacy: loudness only, never stored or sent, app works if refused

On the right add a small flowchart of a Firestore request: Signed in? -> uid matches path? -> fields valid? -> editing a session? -> Allowed or Denied. Export as a PDF.
```

### 12. Big Wave story map  (`12-story-map.pdf`)

```
Create a story map / learning arc diagram as a PDF (landscape A4) for the game "The Big Wave".

Draw a winding path from left to right with 18 scenes as stops, icon-coded by type (story, still, video, game). Mark the interactions: BLOW (microphone) at scenes 3, 7 and 13; DRAG at scenes 5 and 9; TAP at scenes 11 and 15; BREATHE at scene 17.

Order: Intro in the woods; Edge of the woods; Blow out the candle; Through the forest; Forest path (drag); Pile of wood; Blow candle again; Cami and the pile of wood; Clear the path (drag); After the logs are cleared; Jump the 7 logs (tap); Tripping over the log; Blow candle after the fall; The beach; Build the sandcastle (tap); The big wave; Breathing without the candle; Final clip.

Above the path draw an "emotion curve" line: calm at the start, rising tension at the log pile, a dip at the fall, calm at the beach, a peak at the big wave, resolution at the end. Below the path label the skill taught at each stage (paced breathing, small steps, persistence, calm after a setback, self regulation). Final callout: "The calm was inside you all along". Export as a PDF.
```

### 13. Tech stack  (`13-tech-stack.pdf`)

```
Create a tech stack overview infographic as a PDF (landscape A4).

Arrange as horizontal bands, each with the technologies as rounded chips and a one line "why":
- App framework: Expo SDK 58, React Native 0.88, React 19 (one code base for iOS, Android and web)
- Language: JavaScript (JSX)
- Navigation: Expo Router (file based routes, protected routes)
- Animation and graphics: Reanimated 4, Gesture Handler, react-native-svg (characters drawn in code)
- Media and device: expo-video, expo-audio (microphone only), expo-crypto, expo-screen-orientation, expo-font
- Backend as a service: Firebase Authentication, Cloud Firestore, Firebase Hosting
- Serverless AI: Cloudflare Worker, jose (JWT), Google Gemini
- Local storage: AsyncStorage
- Quality: Jest (jest-expo), ESLint
- Design: Figma, custom style guide, Talina + Poppins + DM Mono fonts

Use official-looking simple icons or initials in circles where logos are not available. Export as a PDF.
```

### 14. Deployment pipeline  (`14-deployment.pdf`)

```
Create a deployment diagram as a PDF (landscape A4).

Left: Developer machine with the repo (app + worker/).
Three pipelines to the right:
1. Web: `npx expo export --platform web` -> dist/ -> `firebase deploy --only hosting` -> Firebase Hosting -> users in a browser
2. Database rules: `firebase deploy --only firestore:rules` -> Cloud Firestore security rules
3. Coach: `wrangler secret put GEMINI_API_KEY` and `wrangler deploy` -> Cloudflare Worker (tiny-giants-coach)
Dotted planned pipeline: EAS Build and EAS Submit -> App Store and Google Play (label "planned").

Also show environment variables: EXPO_PUBLIC_FIREBASE_* and EXPO_PUBLIC_COACH_URL read at build time by the app (label: "public identifiers, not secrets"), and GEMINI_API_KEY as a Worker secret (label: "secret"). Export as a PDF.
```

---

## Bonus diagrams (optional)

### 15. Wireframe to final screen comparison  (`15-wireframes.pdf`)

```
Using the attached wireframes and final screenshots, create a before and after comparison sheet as a PDF (landscape A4): wireframe on the left, final screen on the right, for the child home, game intro, parent dashboard, games library and coach chat. Under each pair add one line on what changed and why (for example "buttons enlarged after UX feedback").
```

### 16. Project timeline / process  (`16-process.pdf`)

```
Create a horizontal timeline PDF of my design and development process: Research and moodboard, Wireframes in Figma, Vite web prototype of the original open-book idea, Move to Expo and Expo Router, Child side and game engine, Big Wave scenes and art, Firebase Auth and Firestore, Parent side and PIN gate, Cloudflare Worker AI coach, Testing and UX feedback, Hosting and final polish. Put a milestone marker and a one line learning on each step. Use the Tiny Giants palette. Export as a PDF.
```

### 17. Mic blow detection flow  (`17-blow-detection.pdf`)

```
Create a flowchart PDF for microphone blow detection: Candle scene starts -> ask microphone permission -> (refused or web) status unavailable and the candle blows out by itself; (granted) start recorder with metering on -> poll every 80 ms -> decibels (-50 quiet to -8 loud) -> map to level 0 to 1 -> sustained loud enough? -> candle goes out and onDone(). Add a privacy badge: "Only loudness is read. Nothing is recorded, stored or sent."
```

---

## Tip for the presentation

Ask Claude at the end of the diagram chat:

```
Combine all the diagrams into one PDF in this order: 01, 02, 03, ... with the diagram name as a page title and a one sentence caption underneath each that I can read out loud.
```
