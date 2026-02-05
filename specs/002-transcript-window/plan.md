# Implementation Plan: Transcript Window Fixed Height with Auto-Scroll

**Branch**: `002-transcript-window` | **Date**: 2026-02-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-transcript-window/spec.md`

## Summary

Modify the transcript window UI component to have a fixed height (2× audio status window height), add auto-scrolling to always show the latest transcript entry, and implement a floating badge indicator for new content when users scroll away from live view. This is a frontend-only UI enhancement for the TnT 911 emergency services system.

## Technical Context

**Language/Version**: TypeScript 5.x (frontend)  
**Primary Dependencies**: React 18.x, CSS-in-JS or Tailwind CSS (existing project stack)  
**Storage**: N/A (display-only, transcript data provided by existing service)  
**Testing**: Jest + React Testing Library, Playwright for E2E  
**Target Platform**: Web browser (Chrome, Firefox, Edge - latest versions)  
**Project Type**: Web application (frontend component modification)  
**Performance Goals**: Auto-scroll completes within 500ms of new entry arrival; smooth 60fps scrolling  
**Constraints**: Must not interfere with existing transcript data flow; must work with variable-length transcript entries  
**Scale/Scope**: Single UI component modification; affects telecommunicator workstation view

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| I. Source of Truth | File naming convention (kebab-case) | ✅ PASS | All files use kebab-case |
| II. Three-Track Sync | Track A/B references | ✅ PASS | This is Track A (UX) work; no Track B interface changes required |
| III. Document Lifecycle | Version control | ✅ PASS | Spec versioned in git |
| IV. Milestone-Driven | Maps to milestone | ✅ PASS | Supports M2 transcription UI |
| V. AI Standards | Source citations | ✅ PASS | No external AI content in spec |
| VI. Traceability | Jira linkage | ✅ PASS | Branch follows TNT-XX pattern when linked |
| VII. Information Pipeline | Proper landing zone | ✅ PASS | Spec generated via /speckit-specify |

**Gate Result**: ✅ PASS - No violations. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/002-transcript-window/
├── spec.md              # Feature specification (complete)
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no API contracts)
├── checklists/          # Quality checklists
│   └── requirements.md  # Spec quality checklist (complete)
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (implementation repository)

```text
# Target: https://github.com/Versaterm-Public-Safety/911-Transcription-and-Translation
# This is a frontend component modification

frontend/
├── src/
│   ├── components/
│   │   ├── TranscriptWindow/
│   │   │   ├── TranscriptWindow.tsx      # Main component (modify)
│   │   │   ├── TranscriptWindow.test.tsx # Unit tests (add)
│   │   │   ├── TranscriptEntry.tsx       # Entry display (existing)
│   │   │   ├── NewContentBadge.tsx       # New component (add)
│   │   │   └── useAutoScroll.ts          # Custom hook (add)
│   │   └── AudioStatusWindow/
│   │       └── AudioStatusWindow.tsx     # Reference for height (read-only)
│   └── hooks/
│       └── useResizeObserver.ts          # Resize observation hook (add)
└── tests/
    └── e2e/
        └── transcript-window.spec.ts     # E2E tests (add)
```

**Structure Decision**: Frontend component modification within existing React application. No new top-level directories; extends existing component structure.

## Complexity Tracking

> No violations requiring justification.
