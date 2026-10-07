import { Outlet } from 'react-router-dom';
import { useLandscapeLock } from '../../shared/hooks/useLandscapeLock.js';
import RotatePrompt from './RotatePrompt.jsx';

/**
 * Wraps every /child route in a full-viewport landscape canvas.
 * In portrait we show the rotate prompt instead, but keep the page mounted
 * (just hidden) so turning the phone back doesn't lose the child's place.
 */
export default function ChildLayout() {
  const { isPortrait } = useLandscapeLock();

  return (
    <>
      {isPortrait && <RotatePrompt />}
      <div
        hidden={isPortrait}
        className="fixed inset-0 h-dvh w-dvw overflow-hidden overscroll-none bg-cream select-none"
        style={{
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        }}
      >
        <Outlet />
      </div>
    </>
  );
}
