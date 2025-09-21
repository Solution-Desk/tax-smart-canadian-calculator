import React, { useCallback, useEffect, useId, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

export function Modal({ isOpen, title, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const bodyId = useId();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!dialogRef.current) return;

      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter((element) => element.offsetParent !== null || element === document.activeElement);
        if (focusable.length === 0) {
          event.preventDefault();
          dialogRef.current.focus();
          return;
        }

        const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);
        const nextIndex = event.shiftKey
          ? currentIndex <= 0
            ? focusable.length - 1
            : currentIndex - 1
          : currentIndex === focusable.length - 1
            ? 0
            : currentIndex + 1;

        if (currentIndex === -1) {
          focusable[0].focus();
          event.preventDefault();
          return;
        }

        focusable[nextIndex].focus();
        event.preventDefault();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus({ preventScroll: true });
      }
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const node = dialogRef.current;
    if (!node) {
      return;
    }

    const timer = window.setTimeout(() => {
      const initialFocus = closeButtonRef.current || node.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      initialFocus?.focus({ preventScroll: true });
    }, 0);

    node.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(timer);
      node.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        ref={dialogRef}
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        onClick={(event) => event.stopPropagation()}
        tabIndex={-1}
      >
        <div className="modal-header">
          <h2 id={titleId} className="modal-title">{title}</h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="btn icon modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>
        <div id={bodyId} className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
