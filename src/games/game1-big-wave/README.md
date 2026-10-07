# Game 1 · The Big Wave (working title)

Teaches: coping with stress and big feelings. She travels through the woods to the beach
with her candle, and blows it out whenever she feels overwhelmed, until she learns the
calm was inside her all along.

## Folders

```
game1-big-wave/
  scenes.js        the running order: the game plays this list top to bottom
  scenes/          one file per scene: <number>-<name>.<type>.jsx
  components/      game pieces used by more than one scene (BlowCandleGame: scenes 03 + 10)
  art/             PLACEHOLDER art drawn in code; replaced bit by bit with real art
  assets/
    images/        your PNGs (backgrounds, character poses, castle frames)
    audio/         narration recordings, one per scene (.m4a or .mp3)
    video/         video clips (.mp4, H.264, landscape)
```

The shared engine (scene player, captions, narration, mic) is in `src/games/engine/`.
It's reused by every game, so game 2 only needs its own folder like this one.

## Scenes

| #  | Type  | Scene                             | What the child does                  |
|----|-------|-----------------------------------|--------------------------------------|
| 00 | story | Intro in the woods                | listens, taps Next                   |
| 01 | game  | Forest path                       | drags her along the path             |
| 02 | story | The log pile                      |                                      |
| 03 | game  | Blow out the candle               | blows on the screen (mic)            |
| 04 | story | Baby steps                        |                                      |
| 05 | game  | Clear the path                    | drags logs away, one at a time       |
| 06 | story | Small steps make a difference     |                                      |
| 07 | video | Walking on                        | watches                              |
| 08 | game  | Jump the logs                     | taps to jump; trips on the last one  |
| 09 | story | The fall                          |                                      |
| 10 | game  | Blow out the candle, again        | blows on the screen (mic)            |
| 11 | video | The beach                         | watches                              |
| 12 | game  | Build the sandcastle              | taps to build                        |
| 13 | story | The candle on the castle          |                                      |
| 14 | video | The wave                          | watches                              |
| 15 | game  | Breathing without the candle      | breathes along with her              |
| 16 | story | I never needed the candle         |                                      |
| 17 | story | Sunset ending                     | taps Finish                          |

## Swapping in real files

Every scene file has comments at the top saying exactly what to change. In short:

- **Background picture:** `background={require('../assets/images/02-log-pile.png')}` on the
  StoryScene, and delete the `Art` part.
- **Narration:** `audio={require('../assets/audio/02-log-pile.m4a')}`, then give each line
  the second it starts at, e.g. `{ text: 'Oh no!', at: 0 }, { text: 'Look!', at: 1.8 }`.
  Without `at`, the text is timed by guessing reading speed.
- **Video:** set `SRC = require('../assets/video/14-the-wave.mp4')` at the top of the
  video scene. If the words are already in the video, set `LINES = []`.
- **Castle frames:** list your images in `FRAMES` in `12-build-castle.game.jsx`.

## Microphone (scenes 03 and 10)

The app asks for the microphone the first time the child is asked to blow. If it's
allowed, the flame leans with their breath and a strong puff blows it out. If it's
refused (or on web, or the child doesn't blow within ~9 seconds), she blows it out
herself and the story continues either way. Sensitivity settings are at the top of
`src/games/engine/useBlowDetector.js` and `components/BlowCandleGame.jsx`.

## Testing

In development a small bar at the top right shows the scene number and type, with
‹ › buttons to jump between scenes. It doesn't appear in release builds.
