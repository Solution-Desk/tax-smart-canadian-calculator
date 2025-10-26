import React, { useEffect, useRef } from 'react';

/**
 * Visually hidden but accessible to screen readers
 */
export const VisuallyHidden = ({
  children,
  as: Component = 'div',
  ...props
}: {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  [key: string]: any;
}) => (
  <Component
    style={{
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: 0,
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: 0,
    }}
    {...props}
  >
    {children}
  </Component>
);

/**
 * Live region for announcing dynamic content changes
 */
export const LiveAnnouncer = ({ message, priority = 'polite' }: { message: string; priority?: 'polite' | 'assertive' }) => {
  const liveRegion = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message && liveRegion.current) {
      // Force screen readers to announce the message
      liveRegion.current.textContent = '';
      setTimeout(() => {
        if (liveRegion.current) {
          liveRegion.current.textContent = message;
        }
      }, 100);
    }
  }, [message]);

  return (
    <div
      ref={liveRegion}
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    />
  );
};

/**
 * Skip link for keyboard navigation
 */
export const SkipLink = ({ targetId = 'main-content', label = 'Skip to main content' }) => (
  <a
    href={`#${targetId}`}
    className="fixed -top-12 left-0 z-50 bg-blue-600 text-white px-4 py-2 m-2 rounded transition-transform focus:top-0"
  >
    {label}
  </a>
);

/**
 * Focus trap for modals/dialogs
 */
export const FocusTrap = ({
  children,
  isActive = true,
  onEscape = () => {},
}: {
  children: React.ReactNode;
  isActive?: boolean;
  onEscape?: () => void;
}) => {
  const trapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscape();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusable = trapRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement;

      if (e.shiftKey) {
        if (active === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (active === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onEscape]);

  return <div ref={trapRef}>{children}</div>;
};

/**
 * Accessible form field with proper labeling and error handling
 */
type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  description?: string;
  children: React.ReactElement;
  required?: boolean;
};

export const FormField = ({
  id,
  label,
  error,
  description,
  children,
  required = false,
}: FormFieldProps) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    
    {React.cloneElement(children, {
      id,
      'aria-invalid': !!error,
      'aria-describedby': `${id}-description ${error ? `${id}-error` : ''}`,
      ...children.props,
    })}
    
    {description && (
      <p id={`${id}-description`} className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
    )}
    
    {error && (
      <p id={`${id}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400">
        {error}
      </p>
    )}
  </div>
);

// Add this to your global CSS:
// .sr-only:not(:focus):not(:active) {
//   clip: rect(0 0 0 0);
//   clip-path: inset(50%);
//   height: 1px;
//   overflow: hidden;
//   position: absolute;
//   white-space: nowrap;
//   width: 1px;
// }
