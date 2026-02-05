# Quickstart: Transcript Window Implementation

**Feature**: 002-transcript-window  
**Target Repository**: https://github.com/Versaterm-Public-Safety/911-Transcription-and-Translation

## Prerequisites

1. Clone the implementation repository
2. Node.js 18+ and npm/yarn installed
3. Familiarity with React 18, TypeScript, and CSS

## Quick Reference

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/TranscriptWindow/useAutoScroll.ts` | Auto-scroll hook with scroll state detection |
| `src/components/TranscriptWindow/NewContentBadge.tsx` | Floating badge for new content indicator |
| `src/components/TranscriptWindow/TranscriptWindow.test.tsx` | Unit tests for modified component |
| `src/hooks/useResizeObserver.ts` | Reusable resize observer hook |
| `tests/e2e/transcript-window.spec.ts` | End-to-end tests for scroll behavior |

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/TranscriptWindow/TranscriptWindow.tsx` | Add fixed height, auto-scroll, badge integration |
| `src/components/TranscriptWindow/TranscriptWindow.css` | Height calculation, scroll container, badge positioning |

## Implementation Steps

### Step 1: Create useAutoScroll Hook

```typescript
// src/components/TranscriptWindow/useAutoScroll.ts
import { useRef, useState, useCallback, useEffect } from 'react';

const DEFAULT_THRESHOLD = 50;

export function useAutoScroll(threshold = DEFAULT_THRESHOLD) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLive, setIsLive] = useState(true);

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setIsLive(true);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const atBottom = scrollHeight - scrollTop - clientHeight < threshold;
      setIsLive(atBottom);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return { containerRef, isLive, scrollToBottom };
}
```

### Step 2: Create NewContentBadge Component

```tsx
// src/components/TranscriptWindow/NewContentBadge.tsx
import React from 'react';

interface Props {
  count: number;
  onClick: () => void;
  visible: boolean;
}

export function NewContentBadge({ count, onClick, visible }: Props) {
  if (!visible || count === 0) return null;
  
  return (
    <button
      className="new-content-badge"
      onClick={onClick}
      aria-live="polite"
    >
      {count} new {count === 1 ? 'entry' : 'entries'} ↓
    </button>
  );
}
```

### Step 3: Create useResizeObserver Hook

```typescript
// src/hooks/useResizeObserver.ts
import { useEffect, useRef, useState } from 'react';

export function useResizeObserver<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height
      });
    });
    
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, ...size };
}
```

### Step 4: Modify TranscriptWindow Component

Key modifications to existing component:

```tsx
// Add to TranscriptWindow.tsx
import { useAutoScroll } from './useAutoScroll';
import { useResizeObserver } from '../../hooks/useResizeObserver';
import { NewContentBadge } from './NewContentBadge';

const MIN_HEIGHT = 200;
const HEIGHT_RATIO = 2;

export function TranscriptWindow({ entries, audioStatusRef }: Props) {
  const { containerRef, isLive, scrollToBottom } = useAutoScroll();
  const [newEntryCount, setNewEntryCount] = useState(0);
  
  // Calculate height based on audio status window
  const [height, setHeight] = useState(MIN_HEIGHT * HEIGHT_RATIO);
  
  useEffect(() => {
    if (!audioStatusRef?.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const newHeight = Math.max(entry.contentRect.height * HEIGHT_RATIO, MIN_HEIGHT);
      setHeight(newHeight);
    });
    observer.observe(audioStatusRef.current);
    return () => observer.disconnect();
  }, [audioStatusRef]);

  // Track new entries when not in live mode
  const prevEntriesCount = useRef(entries.length);
  useEffect(() => {
    if (!isLive) {
      const newCount = entries.length - prevEntriesCount.current;
      if (newCount > 0) {
        setNewEntryCount(c => c + newCount);
      }
    } else {
      setNewEntryCount(0);
    }
    prevEntriesCount.current = entries.length;
  }, [entries.length, isLive]);

  // Auto-scroll when in live mode and new entries arrive
  useEffect(() => {
    if (isLive) {
      scrollToBottom();
    }
  }, [entries.length, isLive, scrollToBottom]);

  return (
    <div 
      className="transcript-window"
      style={{ height }}
      ref={containerRef}
    >
      {entries.map(entry => (
        <TranscriptEntry key={entry.id} entry={entry} />
      ))}
      <NewContentBadge 
        count={newEntryCount}
        onClick={() => {
          scrollToBottom();
          setNewEntryCount(0);
        }}
        visible={!isLive && newEntryCount > 0}
      />
    </div>
  );
}
```

### Step 5: Update CSS

```css
/* TranscriptWindow.css */
.transcript-window {
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  min-height: 200px;
}

.new-content-badge {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--badge-bg-color, #0066cc);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 8px 16px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 200ms ease-in-out;
  z-index: 10;
}

.new-content-badge[data-visible="true"] {
  opacity: 1;
}

.new-content-badge:hover {
  background: var(--badge-hover-color, #0052a3);
}
```

## Testing Checklist

- [ ] Height is exactly 2× audio status window height
- [ ] Falls back to 200px when audio window unavailable
- [ ] Auto-scrolls to bottom when new entries arrive (live mode)
- [ ] Stops auto-scroll when user scrolls up
- [ ] Shows badge with count when in review mode
- [ ] Clicking badge scrolls to bottom and hides badge
- [ ] Smooth scroll animation (not instant)
- [ ] Works with rapid transcript updates

## Related Documentation

- [spec.md](./spec.md) - Feature specification
- [research.md](./research.md) - Technical research findings
- [data-model.md](./data-model.md) - Component state and interfaces
