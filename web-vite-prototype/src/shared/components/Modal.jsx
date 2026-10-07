import { useEffect, useId, useRef } from 'react';
import IconButton from './IconButton.jsx';

/**
 * Built on the native <dialog>, which gives us focus trapping, Escape-to-close
 * and an inert background for free. Put `data-autofocus` on the element that
 * should receive focus when the modal opens.
 */
export default function Modal({ open, onClose, title, children }) {
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      dialog.querySelector('[data-autofocus]')?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      // A click on the dialog element itself (not its content) is a click on the backdrop.
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto w-[min(40rem,calc(100dvw-2rem))] rounded-3xl bg-cream p-0 text-ink shadow-2xl backdrop:bg-ink/50"
    >
      <div className="flex max-h-[calc(100dvh-2rem)] flex-col gap-4 overflow-y-auto p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 id={titleId} className="text-2xl font-extrabold">
            {title}
          </h2>
          <IconButton icon="close" label="Close" size="md" onClick={onClose} />
        </div>
        {open && children}
      </div>
    </dialog>
  );
}
