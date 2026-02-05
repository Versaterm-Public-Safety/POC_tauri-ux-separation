# Research: Transcript Window Fixed Height with Auto-Scroll

**Feature**: 002-transcript-window  
**Date**: 2026-02-05  
**Status**: Complete

## Research Summary

This feature is a frontend UI enhancement with well-established patterns. Research focused on best practices for auto-scrolling behavior and responsive height calculations.

---

## R1: Auto-Scroll Implementation Patterns

**Question**: What is the best approach for implementing auto-scroll that pauses on user interaction?

**Decision**: Use a combination of scroll event detection and a "scroll state" flag.

**Rationale**:
- Standard pattern used by chat applications (Slack, Discord, VS Code terminal)
- Detect user scroll via `wheel`, `touchmove`, or `scrollTop` change events
- Track whether user has scrolled away from bottom using a threshold (e.g., within 50px of bottom = "live mode")
- Use `scrollIntoView({ behavior: 'smooth' })` or `scrollTo()` for auto-scroll

**Alternatives Considered**:
1. **Intersection Observer on last element**: More complex, may miss rapid entries
2. **Always force scroll**: Poor UX, users cannot review history
3. **Manual "lock" button only**: Extra UI complexity, users expect auto-pause

**Implementation Notes**:
- Create custom hook `useAutoScroll(containerRef)` returning `{ isLive, scrollToBottom }`
- Threshold for "at bottom" detection: `scrollHeight - scrollTop - clientHeight < 50px`
- Debounce scroll events to prevent performance issues

---

## R2: Dynamic Height Calculation (2:1 Ratio)

**Question**: How to maintain a 2:1 height ratio with another component that may resize?

**Decision**: Use ResizeObserver to watch the audio status window and update transcript window height.

**Rationale**:
- ResizeObserver is the modern, performant way to respond to element size changes
- Works with any cause of resize (window resize, content change, CSS animation)
- Supported in all target browsers (Chrome, Firefox, Edge)

**Alternatives Considered**:
1. **CSS-only with flexbox/grid**: Cannot enforce exact 2:1 ratio with another element
2. **Window resize event only**: Misses internal layout changes
3. **Polling interval**: Wasteful, poor performance

**Implementation Notes**:
- Create `useResizeObserver(ref)` hook or use existing library
- Apply `height: ${audioStatusHeight * 2}px` as inline style or CSS variable
- Fallback to minimum height (200px) if audio status window not found

---

## R3: Floating Badge Component Pattern

**Question**: Best practice for implementing a floating "new content" badge?

**Decision**: Absolutely positioned element within the transcript container with fade-in animation.

**Rationale**:
- Common pattern in messaging apps (WhatsApp, Telegram, Slack)
- Position: `absolute`, `bottom: 16px`, `left: 50%`, `transform: translateX(-50%)`
- Show only when `!isLive && newEntryCount > 0`
- Click handler calls `scrollToBottom()`

**Alternatives Considered**:
1. **Toast notification**: Too intrusive, disappears automatically
2. **Sticky header**: Awkward position for "scroll down" action
3. **Browser native scroll indicators**: Not customizable enough

**Implementation Notes**:
- Component: `NewContentBadge({ count, onClick, visible })`
- Animation: CSS transition on opacity (200ms ease-in-out)
- Accessibility: `aria-live="polite"` for screen readers, `role="button"`

---

## R4: Smooth Scrolling Under Rapid Updates

**Question**: How to handle smooth scrolling when transcript entries arrive faster than animation completes?

**Decision**: Use `requestAnimationFrame` batching and cancel pending scrolls before starting new ones.

**Rationale**:
- Prevents scroll animations from queuing up and causing jerky behavior
- Single scroll to final position is smoother than multiple sequential scrolls
- Standard approach for real-time UIs

**Alternatives Considered**:
1. **No animation (instant scroll)**: Less polished, can be disorienting
2. **Throttle entries**: Would hide entries from user, unacceptable for 911
3. **Queue animations**: Creates backlog, scroll position lags behind

**Implementation Notes**:
- Track pending scroll with ref: `pendingScrollRef.current`
- Cancel pending with `cancelAnimationFrame()` before scheduling new
- Consider reducing animation duration for rapid updates (e.g., 100ms instead of 300ms)

---

## R5: Performance Considerations

**Question**: What performance optimizations are needed for potentially long transcript sessions?

**Decision**: Implement virtualization for very long transcripts (optional, only if needed).

**Rationale**:
- Typical 911 calls are short (average 2-3 minutes), producing ~20-50 entries
- Virtualization adds complexity and may break scroll position tracking
- Start simple; add virtualization only if performance issues observed

**Alternatives Considered**:
1. **Always virtualize**: Over-engineering for typical use case
2. **Paginate old entries**: Complicates scroll-back UX
3. **Discard old entries**: Loses potentially important information

**Implementation Notes**:
- Monitor performance with 100+ entries during testing
- If needed, consider `react-window` or `react-virtualized`
- Keep all entries in memory; only virtualize DOM rendering

---

## Technology Decisions Summary

| Decision | Choice | Confidence |
|----------|--------|------------|
| Auto-scroll detection | Scroll position threshold + event listeners | High |
| Height sync | ResizeObserver | High |
| Badge component | Absolutely positioned, fade animation | High |
| Rapid scroll handling | requestAnimationFrame batching | High |
| Virtualization | Defer unless needed | Medium |

---

## Open Questions (None)

All technical questions have been resolved. Ready for Phase 1 design.
