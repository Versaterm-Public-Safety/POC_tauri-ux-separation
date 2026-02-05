# Stitch Components

This directory contains **AI-generated, swappable** UI components following the "stitch line" architecture pattern.

## Architecture

Components in this directory are designed to be replaceable by UX teams without modifying:
- State management (`src/store/callStore.ts`)
- WebSocket communication (`src/hooks/useWebSocket.ts`)
- Type contracts (`src/types/messages.ts`)

## Components

### TranscriptPanel

Real-time transcript display with auto-scroll and review mode.

**Props:**
```typescript
interface TranscriptPanelProps {
  messages: TranscriptSegment[];
  audioStatusRef?: React.RefObject<HTMLElement>;
  onScrollStateChange?: (isLive: boolean) => void;
}
```

**Features (Feature 002):**
- Fixed height (2× audio status window, min 200px)
- Auto-scroll to latest entry when in live mode
- Pause auto-scroll when user scrolls up (review mode)
- Floating badge showing new entry count
- Click badge to return to live view
- Smooth scrolling animations

**Usage:**
```tsx
<TranscriptPanel 
  messages={transcripts} 
  audioStatusRef={audioRef}
  onScrollStateChange={(isLive) => console.log('Live mode:', isLive)}
/>
```

### NewContentBadge

Floating badge for new content indicator.

**Props:**
```typescript
interface NewContentBadgeProps {
  count: number;
  onClick: () => void;
  visible: boolean;
}
```

**Accessibility:**
- Uses `aria-live="polite"` for screen readers
- Keyboard accessible button

### AudioStatusIndicator

Displays audio channel status for caller and telecommunicator.

### ControlPanel

Call control buttons (start/end call).

### LanguageBadge

Displays detected language for each speaker.

### NotificationToast

Toast notifications for system messages.

## Hooks

### useAutoScroll (`src/hooks/useAutoScroll.ts`)

Manages auto-scroll behavior with scroll state detection.

```typescript
const { containerRef, isLive, scrollToBottom } = useAutoScroll({
  threshold: 50,        // pixels from bottom to consider "live"
  scrollBehavior: 'smooth'
});
```

### useResizeObserver (`src/hooks/useResizeObserver.ts`)

Observes element size changes for dynamic height calculation.

```typescript
const { ref, width, height } = useResizeObserver();
const externalSize = useExternalResizeObserver(externalRef);
```

## Design System

Uses Tailwind CSS with Versaterm brand colors:
- **Primary**: `#2563eb` (blue)
- **Primary Dark**: `#1e3a5f`
- **Accent**: `#059669` (green)
- **Error**: `#dc2626` (red)

## Swappability Rules

1. **Props interface is immutable** - implementation can change, interface cannot
2. **No direct state access** - consume from Zustand store via selectors
3. **No WebSocket logic** - all communication through `useWebSocket` hook
4. **Self-contained styling** - Tailwind classes only
5. **Type-safe props** - explicit TypeScript interfaces
