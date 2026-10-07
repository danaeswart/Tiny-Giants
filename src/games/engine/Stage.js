import { createContext, useContext } from 'react';

// The size of the game area, measured once by ScenePlayer. Scenes use it to place
// characters and work out drag distances, instead of each one measuring itself.
export const StageContext = createContext({ width: 0, height: 0 });

/** { width, height } of the stage in pixels. */
export function useStage() {
  return useContext(StageContext);
}
