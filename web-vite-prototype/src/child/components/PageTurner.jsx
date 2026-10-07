import { useRef } from 'react';
import {
  AnimatePresence,
  animate,
  motion,
  useIsPresent,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react';

const TURN = { duration: 0.65, ease: [0.645, 0.045, 0.355, 1] };
const SPRING_BACK = { type: 'spring', stiffness: 320, damping: 30 };

// A swipe turns the page if it travels this fraction of the page width, or is flicked fast enough.
const SWIPE_DISTANCE = 0.2;
const SWIPE_VELOCITY = 400;
// Movement below this is still treated as a tap (small fingers wobble).
const TAP_SLOP = 10;

/*
 * Pages hinge on their left edge (the spine), like a real book.
 *  - Next (dir > 0): the current page lifts and swings over the spine, revealing
 *    the next page that was already lying underneath.
 *  - Previous (dir < 0): the previous page swings back over the spine on top of
 *    the current one, which stays put until it's covered.
 * backface-visibility hides each page once it passes edge-on (-90deg).
 */
const flip = {
  enter: (dir) => ({ rotateY: dir < 0 ? -180 : 0, zIndex: 1, opacity: 1 }),
  center: { rotateY: 0, zIndex: 1, opacity: 1, transition: TURN },
  exit: (dir) =>
    dir > 0
      ? { rotateY: -180, zIndex: 2, transition: TURN }
      : { zIndex: 0, opacity: 0, transition: { opacity: { delay: TURN.duration, duration: 0 } } },
};

const fade = {
  enter: { opacity: 0, zIndex: 1 },
  center: { opacity: 1, zIndex: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, zIndex: 0, transition: { duration: 0.25 } },
};

/**
 * Book-style page turning with swipe (following the finger) and programmatic turns.
 * The parent owns which page is showing; change `index` + `direction` to turn.
 */
export default function PageTurner({ index, count, direction, onPrev, onNext, renderPage }) {
  const reduceMotion = useReducedMotion();
  const canPrev = index > 0;
  const canNext = index < count - 1;

  return (
    <div className="relative h-full w-full" style={{ perspective: '2200px' }}>
      {/* The next page is already lying underneath, so lifting this one reveals it. */}
      {canNext && (
        <div className="absolute inset-0" style={{ zIndex: 0 }} aria-hidden="true" inert>
          {renderPage(index + 1)}
        </div>
      )}
      <AnimatePresence initial={false} custom={direction}>
        <TurnablePage
          key={index}
          direction={direction}
          reduceMotion={reduceMotion}
          canPrev={canPrev}
          canNext={canNext}
          onPrev={onPrev}
          onNext={onNext}
        >
          {renderPage(index)}
        </TurnablePage>
      </AnimatePresence>
    </div>
  );
}

function TurnablePage({ direction, reduceMotion, canPrev, canNext, onPrev, onNext, children }) {
  const ref = useRef(null);
  const isPresent = useIsPresent();
  const rotateY = useMotionValue(0);
  const nudge = useMotionValue(0);
  // The page darkens slightly as it turns, like it's catching less light.
  const shade = useTransform(rotateY, [-180, -90, 0], [0, 0.3, 0]);
  const didSwipe = useRef(false);

  const pageWidth = () => ref.current?.offsetWidth || 1;

  function handlePan(_, { offset }) {
    if (!isPresent) return;
    if (Math.abs(offset.x) > TAP_SLOP) didSwipe.current = true;

    if (offset.x < 0) {
      // Dragging left lifts the page towards the spine, following the finger.
      // On the last page it only lifts a little, then resists.
      const limit = canNext ? -170 : -15;
      if (!reduceMotion) rotateY.set(Math.max(limit, (offset.x / pageWidth()) * 180));
      nudge.set(0);
    } else {
      // Dragging right gives a gentle nudge; the previous page swings in on release.
      rotateY.set(0);
      nudge.set(Math.min(offset.x * 0.15, 32));
    }
  }

  function handlePanEnd(_, { offset, velocity }) {
    if (!isPresent) return;
    const distance = pageWidth() * SWIPE_DISTANCE;
    animate(nudge, 0, SPRING_BACK);

    if (canNext && offset.x < 0 && (offset.x < -distance || velocity.x < -SWIPE_VELOCITY)) {
      onNext();
      return; // exit variant carries on from the current angle
    }
    if (canPrev && offset.x > 0 && (offset.x > distance || velocity.x > SWIPE_VELOCITY)) {
      onPrev();
    }
    animate(rotateY, 0, SPRING_BACK);
  }

  return (
    <motion.div
      ref={ref}
      custom={direction}
      variants={reduceMotion ? fade : flip}
      initial="enter"
      animate="center"
      exit="exit"
      aria-hidden={!isPresent}
      onPan={handlePan}
      onPanEnd={handlePanEnd}
      onPointerDownCapture={() => {
        didSwipe.current = false;
      }}
      // A swipe that happens to end on the Play button shouldn't count as pressing it.
      onClickCapture={(e) => {
        if (didSwipe.current) {
          e.preventDefault();
          e.stopPropagation();
          didSwipe.current = false;
        }
      }}
      className="absolute inset-0"
      style={{
        rotateY,
        x: nudge,
        transformOrigin: 'left center',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        touchAction: 'none',
        pointerEvents: isPresent ? 'auto' : 'none',
      }}
    >
      {children}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-l-md rounded-r-2xl bg-ink"
        style={{ opacity: shade }}
      />
    </motion.div>
  );
}
