# Tiny Giants

Children's emotional-learning app. Expo (React Native) + Expo Router, plain JavaScript.

## Run it on your phone (Expo Go)

1. Install **Expo Go** from the App Store or Google Play.
2. In this folder: `npm install` (first time only), then `npm start`.
3. Scan the QR code in the terminal:
   - **iPhone:** with the Camera app.
   - **Android:** from inside Expo Go ("Scan QR code").

Your phone and computer need to be on the same Wi-Fi. If it can't connect (school/work
networks often block this), run `npx expo start --tunnel` instead. On Windows, allow Node.js
through the firewall on private networks when prompted.

Press `w` in the terminal to open it in a browser instead.

## Where things are

```
src/
  app/        Expo Router routes: thin files that point at the pages below
  child/      Child screens (landscape-locked): pages/ + components/
  adult/      Parent screens (any orientation): pages/ + components/
  shared/     Used by both: components/, data/ (mock), services/api.js, hooks/, theme.js
```

- All data goes through `src/shared/services/api.js`. It uses the mock data in
  `src/shared/data/` for now; swap in real backend calls there.
- Child screens only ever call `getEnabledGamesForChild`, so a parent's choices in
  **Manage games** (`/adult/children/child-1/games`) apply everywhere.
- All text goes through `AppText`, which never renders below 16px.
## Adding book art

The storybook is an open book: each game is one two-page spread, with Play on the right page.

1. Put your PNGs in `assets/book/`. Pages are slightly taller than wide (width:height 0.97),
   so export each page at that ratio, e.g. 970 × 1000 px.
2. Register each file in `src/shared/data/images.js`:
   `'big-wave-left.png': require('../../../assets/book/big-wave-left.png'),`
3. Point to it:
   - a game's pages: `pages: { left: 'big-wave-left.png', right: 'big-wave-right.png' }` in
     `src/shared/data/games.js`
   - the front cover: `frontCover: 'book-front-cover.png'` in `src/shared/data/book.js`

Until a page has art, the left page shows the game's title and the right page is plain.
Once the left page has art, the title is hidden visually (but still read by screen readers),
since the art usually includes it.

`web-vite-prototype/` is the earlier Vite web version, kept for reference. Safe to delete.
