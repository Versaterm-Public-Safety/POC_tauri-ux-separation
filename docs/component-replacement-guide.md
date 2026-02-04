# Component Replacement Guide

> **For UX Team**: How to replace AI-generated components with human-designed components

## Overview

All components in `src/components/stitch/` are designed to be **swappable**. They follow a consistent interface pattern that allows you to replace AI-generated components with your own designs without changing any backend code or state management.

## 🎯 Key Principle: Interface Stability

Each component has a **fixed interface (props)** but **flexible implementation**. As long as you maintain the same props, you can completely rewrite the component's internal implementation.

## 📦 Swappable Components

### 1. LanguageBadge

**Location**: `src/components/stitch/LanguageBadge.tsx`

**Purpose**: Displays detected language with confidence percentage

**Interface**:
```typescript
interface LanguageBadgeProps {
  speaker: 'caller' | 'telecommunicator';
  languageCode: string;      // e.g., "es", "en"
  languageName: string;       // e.g., "Spanish", "English"
  confidence: number;         // 0.0 to 1.0
  status: 'detecting' | 'confirmed' | 'none';
}
```

**Design Notes**:
- Current: Badge-style with color coding based on confidence
- Versaterm Brand: Uses green for confirmed, yellow for detecting
- Consider: Accessibility requirements for color-blind users

**How to Replace**:
1. Create your new component with the same props interface
2. Export it with the same name: `export function LanguageBadge(...)`
3. Replace the file content or create alongside and update import in `App.tsx`

---

### 2. TranscriptPanel

**Location**: `src/components/stitch/TranscriptPanel.tsx`

**Purpose**: Chat-style two-speaker transcript display

**Interface**:
```typescript
interface TranscriptPanelProps {
  messages: TranscriptSegment[];  // Array of transcript segments
}

// TranscriptSegment from types/messages.ts
interface TranscriptSegment {
  speaker: 'caller' | 'telecommunicator';
  text: string;
  timestamp: number;
  isFinal: boolean;  // false for interim (live) transcription
}
```

**Design Notes**:
- Current: Chat bubbles, caller on left (white), telecommunicator on right (blue)
- Auto-scrolls to bottom on new messages
- Interim messages shown with reduced opacity and italic
- Versaterm Brand: Professional blues for telecommunicator, neutral for caller

**How to Replace**:
1. Maintain `messages` array as single prop
2. Implement your own layout (list, table, cards, etc.)
3. Ensure timestamps and interim state are visually distinguishable
4. Test with rapid updates (mock backend sends messages every 2s)

---

### 3. ControlPanel

**Location**: `src/components/stitch/ControlPanel.tsx`

**Purpose**: Call control buttons with status and timer

**Interface**:
```typescript
interface ControlPanelProps {
  callState: 'idle' | 'connecting' | 'active' | 'ended';
  callStartTime: number | null;  // Unix timestamp in ms
  onStartCall: () => void;
  onEndCall: () => void;
}
```

**Design Notes**:
- Current: Large buttons, status indicator dot, call duration timer
- Shows "Start Call" when idle/ended, "End Call" when active/connecting
- Timer updates every second during active call
- Versaterm Brand: Green for start, red for end

**How to Replace**:
1. Keep all four props (state, time, two callbacks)
2. Implement your own button styling and layout
3. Calculate duration: `Math.floor((Date.now() - callStartTime!) / 1000)`
4. Call appropriate callback on button click

---

### 4. AudioStatusIndicator

**Location**: `src/components/stitch/AudioStatusIndicator.tsx`

**Purpose**: Shows audio streaming status for both channels

**Interface**:
```typescript
interface AudioStatusIndicatorProps {
  callerStatus: ChannelStatus;
  telecommunicatorStatus: ChannelStatus;
}

interface ChannelStatus {
  status: 'streaming' | 'muted' | 'disconnected';
  level?: number;  // 0-100, optional
}
```

**Design Notes**:
- Current: Two rows, icons change based on status, audio level bars
- Green for streaming, yellow for muted, gray for disconnected
- Level visualization with 5-bar meter
- Updates every 500ms from backend

**How to Replace**:
1. Maintain two-channel structure (caller + telecommunicator)
2. Show all three status states clearly
3. Optional: Visualize `level` if present (0-100 scale)
4. Consider accessibility for status beyond color alone

---

### 5. NotificationToast

**Location**: `src/components/stitch/NotificationToast.tsx`

**Purpose**: Toast notifications for system messages

**Interface**:
```typescript
interface NotificationToastProps {
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  onClose: () => void;
  duration?: number;  // milliseconds, default 3000
}
```

**Design Notes**:
- Current: Top-right positioned, auto-dismisses after duration
- Different colors per type (blue/green/yellow/red)
- Icons for each type
- Slide-in animation

**How to Replace**:
1. Keep all props including `onClose` callback
2. Implement auto-dismiss with `useEffect` timer
3. Call `onClose()` when dismissed
4. Consider position (current: top-right) and animations

---

## 🔄 Replacement Workflow

### Step 1: Create Your Component

```typescript
// src/components/custom/MyLanguageBadge.tsx
import React from 'react';

interface LanguageBadgeProps {
  speaker: 'caller' | 'telecommunicator';
  languageCode: string;
  languageName: string;
  confidence: number;
  status: 'detecting' | 'confirmed' | 'none';
}

export function LanguageBadge(props: LanguageBadgeProps) {
  // Your custom implementation
  return <div>Your design here</div>;
}
```

### Step 2: Update Import in App.tsx

**Before**:
```typescript
import { LanguageBadge } from './components/stitch/LanguageBadge';
```

**After**:
```typescript
import { LanguageBadge } from './components/custom/MyLanguageBadge';
```

### Step 3: Test

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm run dev`
3. Click "Start Call" and verify your component works
4. Check that all states render correctly
5. Verify no console errors

### Step 4: Iterate

- **Backend unchanged**: No need to restart or modify backend
- **State management unchanged**: Zustand store still works
- **Hot reload**: Vite will update your component instantly

---

## 🎨 Design Consistency

### Versaterm Brand Guidelines

- **Primary**: `#1e3a5f` (dark blue), `#2563eb` (bright blue)
- **Accent**: `#059669` (green)
- **Error**: `#dc2626` (red)
- **Tailwind Config**: See `tailwind.config.js`

### Accessibility Requirements

- ✅ High contrast ratios (WCAG AA minimum)
- ✅ Color is not the only indicator of state
- ✅ Screen reader friendly (use ARIA labels)
- ✅ Keyboard navigable for controls

---

## 🧪 Testing Your Components

### Manual Testing Checklist

- [ ] Component renders without errors
- [ ] All props are used correctly
- [ ] State changes reflect in UI (e.g., call state transitions)
- [ ] Interim vs final transcripts are distinguishable
- [ ] Timers and counters update correctly
- [ ] Buttons trigger correct callbacks
- [ ] Toast notifications auto-dismiss
- [ ] Audio level bars animate smoothly

### Browser and Desktop Testing

```bash
# Test in browser
npm run dev

# Test in Tauri desktop
npm run tauri:dev
```

Both should work identically with your component.

---

## 💡 Tips

1. **Start Small**: Replace one component at a time
2. **Keep Props Interface**: Don't change prop names or types
3. **Check Types**: TypeScript will catch interface mismatches
4. **Use Dev Tools**: React DevTools helps debug props
5. **Log Props**: `console.log(props)` to understand data flow
6. **Copy & Modify**: Start with AI component, then customize
7. **Ask Questions**: If props interface doesn't fit your design, discuss with architecture team

---

## 📚 Related Guides

- **[Figma-to-Code Strategy Guide](./figma-to-code-strategy-guide.md)**: Tools for exporting Figma designs
- **[Demo Runbook](./demo-runbook.md)**: Step-by-step demo instructions

---

## ❓ FAQ

**Q: Can I add new props to a component?**  
A: Only if you also update the parent component (`App.tsx`) and ensure backward compatibility.

**Q: Can I change the component's internal state?**  
A: Yes! Internal state (`useState`, etc.) is yours to manage. Only the props interface must stay stable.

**Q: What if I need data not in the props?**  
A: You can access the Zustand store directly: `import { useCallStore } from '../../store/callStore'`

**Q: Can I use a different CSS framework?**  
A: Yes, but Tailwind is already configured. Adding another might increase bundle size.

**Q: Where do I put shared utilities?**  
A: Create `src/utils/` or `src/lib/` for shared functions and constants.

---

**Last Updated**: 2024-02-04  
**Maintainer**: Versaterm Design Systems Team
