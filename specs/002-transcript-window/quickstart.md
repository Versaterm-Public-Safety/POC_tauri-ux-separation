# Quickstart: Transcript Window Implementation

**Feature**: 002-transcript-window  
**Target Repository**: POC_tauri-ux-separation (this repo)

## Prerequisites

1. Node.js 18+ and npm installed
2. Familiarity with React 18, TypeScript, and Tailwind CSS
3. Backend running: `cd backend && npm run dev`

## Quick Reference

### Files Created

| File | Purpose |
|------|---------|
| `src/hooks/useAutoScroll.ts` | Auto-scroll hook with scroll state detection |
| `src/hooks/useResizeObserver.ts` | Reusable resize observer hook |
| `src/components/stitch/NewContentBadge.tsx` | Floating badge for new content indicator |
| `tests/test-transcript-scroll.mjs` | Contract tests for scroll behavior |

### Files Modified

| File | Changes |
|------|---------|
| `src/components/stitch/TranscriptPanel.tsx` | Fixed height, auto-scroll, badge integration |
| `tailwind.config.js` | Added transcript sizing and badge animation config |

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

### Contract Tests (Automated)

Run from repository root:
```bash
node tests/test-transcript-scroll.mjs
```

### Browser-Based E2E Validation (Manual)

**Setup:**
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm run dev`
3. Open http://localhost:1420

**FR-001: Fixed Height (2× Audio Status)**
- [ ] Transcript window height is approximately 2× the audio status window
- [ ] Use browser DevTools to measure: `$0.offsetHeight` on both elements

**FR-002: Vertical Scroll Bar**
- [ ] Scroll bar appears when content exceeds visible area
- [ ] Scroll bar is visible on the right side of transcript window

**FR-003: Auto-Scroll to Latest Entry**
- [ ] Click "Start Call" to begin receiving transcripts
- [ ] New entries automatically appear at the bottom
- [ ] No manual scrolling required to see latest entry

**FR-004: Pause Auto-Scroll on Manual Scroll**
- [ ] While call is active, scroll up manually
- [ ] New entries arrive but view stays at current position
- [ ] Auto-scroll is paused

**FR-005: Floating Badge**
- [ ] When scrolled up during active call, badge appears at bottom
- [ ] Badge shows count of new entries (e.g., "3 new entries ↓")
- [ ] Badge updates count as more entries arrive

**FR-006: Resume Auto-Scroll**
- [ ] Click the badge to return to live view
- [ ] Badge disappears after clicking
- [ ] Auto-scroll resumes showing latest entries

**FR-007: Maintain Ratio on Resize**
- [ ] Resize browser window
- [ ] Transcript window maintains proportional height relationship

**FR-008: Smooth Scrolling**
- [ ] Auto-scroll animation is smooth (not instant/jarring)
- [ ] No visual jumps when rapid entries arrive

**FR-009: Fallback Height**
- [ ] If audio status window is hidden, transcript uses 200px minimum height

**SC-001: Performance (500ms)**
- [ ] Open DevTools Performance panel
- [ ] Record during active call
- [ ] Verify scroll completes within 500ms of new entry

### Edge Cases

**Long Entry Text Wrapping**
- [ ] Long transcript text wraps within the message bubble
- [ ] No horizontal scroll bar appears
- [ ] Text remains readable

**Rapid-Fire Entries**
- [ ] Multiple entries arriving in quick succession
- [ ] Scroll remains smooth, not jerky
- [ ] All entries are visible in order

**Empty State**
- [ ] Before call starts, shows placeholder text
- [ ] No scroll bar when no entries exist

## Related Documentation

- [spec.md](./spec.md) - Feature specification
- [research.md](./research.md) - Technical research findings
- [data-model.md](./data-model.md) - Component state and interfaces
