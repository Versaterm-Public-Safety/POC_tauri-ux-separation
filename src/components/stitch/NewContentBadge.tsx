interface NewContentBadgeProps {
  /** Number of new entries to display */
  count: number;
  /** Handler for click to scroll down */
  onClick: () => void;
  /** Whether the badge is visible */
  visible: boolean;
}

/**
 * Floating badge component for new content indicator.
 * Implements FR-005: floating badge showing count of new entries.
 * 
 * Accessibility: Uses aria-live for screen readers and role="button".
 */
export function NewContentBadge({ count, onClick, visible }: NewContentBadgeProps) {
  if (!visible || count === 0) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        absolute bottom-4 left-1/2 -translate-x-1/2 z-10
        bg-primary text-white
        px-4 py-2 rounded-full
        text-sm font-medium
        shadow-lg hover:bg-primary-dark
        transition-opacity duration-badge
        cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
      aria-live="polite"
      aria-label={`${count} new ${count === 1 ? 'entry' : 'entries'}. Click to scroll to latest.`}
    >
      {count} new {count === 1 ? 'entry' : 'entries'} ↓
    </button>
  );
}
