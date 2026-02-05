# Data Model: Transcript Window

**Feature**: 002-transcript-window  
**Date**: 2026-02-05  
**Status**: Complete

## Overview

This feature is a UI-only enhancement. It does not introduce new persistent data storage or modify existing data models. The data model below describes the component state and prop interfaces.

---

## Component State Model

### TranscriptWindow Component

```typescript
interface TranscriptWindowState {
  /** Whether the user is at the bottom of the scroll (live mode) */
  isLive: boolean;
  
  /** Count of new entries since user scrolled away from bottom */
  newEntryCount: number;
  
  /** Calculated height based on audio status window */
  calculatedHeight: number;
  
  /** Minimum height fallback in pixels */
  minHeight: 200;
}
```

### State Transitions

```
┌─────────────────────────────────────────────────────────────┐
│                    LIVE MODE (isLive: true)                  │
│  - Auto-scroll enabled                                       │
│  - newEntryCount = 0                                         │
│  - Badge hidden                                              │
└─────────────────────────────────────────────────────────────┘
         │                                      ▲
         │ User scrolls up                      │ scrollToBottom()
         │ (scrollTop < threshold)              │ OR user scrolls to bottom
         ▼                                      │
┌─────────────────────────────────────────────────────────────┐
│                  REVIEW MODE (isLive: false)                 │
│  - Auto-scroll disabled                                      │
│  - newEntryCount increments on new entries                   │
│  - Badge visible when newEntryCount > 0                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Props Interface

### TranscriptWindow Props

```typescript
interface TranscriptWindowProps {
  /** Array of transcript entries to display */
  entries: TranscriptEntry[];
  
  /** Reference to audio status window for height calculation */
  audioStatusRef?: React.RefObject<HTMLElement>;
  
  /** Optional callback when scroll state changes */
  onScrollStateChange?: (isLive: boolean) => void;
  
  /** Optional class name for styling */
  className?: string;
}
```

### TranscriptEntry (existing)

```typescript
// Existing interface - NOT modified by this feature
interface TranscriptEntry {
  id: string;
  timestamp: Date;
  speaker: 'caller' | 'operator' | 'system';
  text: string;
  confidence?: number;
  language?: string;
}
```

### NewContentBadge Props

```typescript
interface NewContentBadgeProps {
  /** Number of new entries to display */
  count: number;
  
  /** Handler for click to scroll down */
  onClick: () => void;
  
  /** Whether the badge is visible */
  visible: boolean;
}
```

---

## Custom Hooks

### useAutoScroll

```typescript
interface UseAutoScrollOptions {
  /** Threshold in pixels for "at bottom" detection (default: 50) */
  threshold?: number;
  
  /** Behavior for scroll animation (default: 'smooth') */
  scrollBehavior?: ScrollBehavior;
}

interface UseAutoScrollReturn {
  /** Whether user is at the scroll bottom */
  isLive: boolean;
  
  /** Function to scroll to bottom */
  scrollToBottom: () => void;
  
  /** Ref to attach to scrollable container */
  containerRef: React.RefObject<HTMLElement>;
}

function useAutoScroll(options?: UseAutoScrollOptions): UseAutoScrollReturn;
```

### useResizeObserver

```typescript
interface UseResizeObserverReturn {
  /** Current width of observed element */
  width: number;
  
  /** Current height of observed element */
  height: number;
  
  /** Ref to attach to observed element */
  ref: React.RefObject<HTMLElement>;
}

function useResizeObserver(): UseResizeObserverReturn;
```

---

## CSS Custom Properties

```css
:root {
  /* Transcript window sizing */
  --transcript-min-height: 200px;
  --transcript-height-ratio: 2;
  
  /* Badge styling */
  --badge-bg-color: var(--primary-color, #0066cc);
  --badge-text-color: white;
  --badge-border-radius: 16px;
  --badge-animation-duration: 200ms;
  
  /* Scroll behavior */
  --scroll-threshold: 50px;
}
```

---

## Validation Rules

| Field | Rule | Error Handling |
|-------|------|----------------|
| `entries` | Must be array | Show empty state if undefined/null |
| `audioStatusRef` | Optional | Fall back to minHeight if missing |
| `newEntryCount` | Non-negative integer | Clamp to 0 minimum |
| `calculatedHeight` | >= minHeight | Apply max(calculated, minHeight) |

---

## Relationships

```
┌─────────────────────────┐
│    AudioStatusWindow    │
│   (read height only)    │
└───────────┬─────────────┘
            │ ResizeObserver
            ▼
┌─────────────────────────┐       ┌─────────────────────────┐
│    TranscriptWindow     │◄──────│   Transcript Service    │
│  (this feature target)  │       │    (existing, unmod)    │
└───────────┬─────────────┘       └─────────────────────────┘
            │ contains
            ▼
┌─────────────────────────┐
│    NewContentBadge      │
│    (new component)      │
└─────────────────────────┘
```

---

## Notes

- This is a UI-only feature; no database schema changes required
- TranscriptEntry interface is pre-existing and not modified
- All state is component-local; no global state management changes needed
