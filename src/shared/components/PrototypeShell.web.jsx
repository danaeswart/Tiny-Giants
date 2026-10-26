import { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { colors } from '../theme.js';

// Web-only prototype wrapper. On a desktop browser the app is not stretched across the whole
// window; it lives inside an iPhone mockup. The app itself runs in an iframe so it gets a real
// phone-sized viewport (media queries, useWindowDimensions and 100vh all behave as on a phone).
// The embedded app reports its orientation (child routes landscape, adult routes portrait) and
// the mockup rotates to match.

const PHONE = { long: 844, short: 390 }; // iPhone 14 points
const BEZEL = 14;
const STATUS = 47; // room for the status bar (portrait) or the camera island (landscape)
const ORIENTATION_MESSAGE = 'tg-orientation';
const PHONE_BREAKPOINT = 500; // on a real phone-sized window, skip the mockup

export const isEmbedded = () => typeof window !== 'undefined' && window.self !== window.top;

export function shouldShowMockup() {
  if (typeof window === 'undefined') return false;
  return !isEmbedded() && window.innerWidth > PHONE_BREAKPOINT;
}

export function reportOrientation(mode) {
  if (!isEmbedded()) return;
  window.parent.postMessage({ type: ORIENTATION_MESSAGE, mode }, window.location.origin);
}

export default function PrototypeShell() {
  const [landscape, setLandscape] = useState(false);
  const [src] = useState(() => `${window.location.pathname}${window.location.search}${window.location.hash}`);
  const { width: winW, height: winH } = useWindowDimensions();

  useEffect(() => {
    const onMessage = (event) => {
      if (event.origin !== window.location.origin || event.data?.type !== ORIENTATION_MESSAGE) return;
      setLandscape(event.data.mode === 'landscape');
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const screenW = landscape ? PHONE.long : PHONE.short;
  const screenH = landscape ? PHONE.short : PHONE.long;
  const frameW = screenW + BEZEL * 2;
  const frameH = screenH + BEZEL * 2;
  const scale = Math.min(1, (winW - 48) / frameW, (winH - 48) / frameH);

  const statusBar = {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: colors.ink,
    fontFamily: 'system-ui, sans-serif',
    fontSize: 16,
    fontWeight: 600,
    pointerEvents: 'none',
    ...(landscape
      ? { top: 0, bottom: 0, left: 0, width: STATUS, flexDirection: 'column', padding: '24px 0' }
      : { top: 0, left: 0, right: 0, height: STATUS, flexDirection: 'row', padding: '10px 32px 0' }),
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 30% 20%, #3a2a66 0%, #241447 60%, #170c30 100%)',
        overflow: 'hidden',
      }}
    >
      <div style={{ width: frameW * scale, height: frameH * scale, transition: 'width 0.4s, height 0.4s' }}>
        <div
          style={{
            position: 'relative',
            width: frameW,
            height: frameH,
            boxSizing: 'border-box',
            padding: BEZEL,
            borderRadius: 64,
            background: '#0d0d12',
            boxShadow: '0 0 0 3px #3b3b46, 0 30px 80px rgba(0, 0, 0, 0.55)',
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            transition: 'width 0.4s, height 0.4s',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: screenW,
              height: screenH,
              borderRadius: 50,
              overflow: 'hidden',
              background: colors.cream,
              transition: 'width 0.4s, height 0.4s',
            }}
          >
            <iframe
              title="Tiny Giants app prototype"
              src={src}
              allow="autoplay; microphone; fullscreen"
              style={{
                position: 'absolute',
                border: 0,
                background: colors.cream,
                ...(landscape
                  ? { top: 0, bottom: 0, right: 0, left: STATUS }
                  : { top: STATUS, bottom: 0, left: 0, right: 0 }),
              }}
            />
            <div style={statusBar}>
              {landscape ? null : <span>9:41</span>}
              {landscape ? null : <span>100%</span>}
            </div>
            {/* Camera island */}
            <div
              style={{
                position: 'absolute',
                background: '#0d0d12',
                borderRadius: 20,
                pointerEvents: 'none',
                ...(landscape
                  ? { left: 12, top: '50%', width: 34, height: 120, marginTop: -60 }
                  : { top: 11, left: '50%', width: 120, height: 34, marginLeft: -60 }),
              }}
            />
            {/* Home indicator */}
            <div
              style={{
                position: 'absolute',
                bottom: 8,
                left: '50%',
                width: 140,
                height: 5,
                marginLeft: -70,
                borderRadius: 3,
                background: colors.ink,
                opacity: 0.5,
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
