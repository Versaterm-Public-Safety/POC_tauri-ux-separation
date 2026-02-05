# Tasks: Transcript Window Fixed Height with Auto-Scroll

**Input**: Design documents from `/specs/002-transcript-window/`  
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓, quickstart.md ✓

**Tests**: Included in this task list as specified in plan.md (Jest + React Testing Library, Playwright E2E)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app frontend**: `src/`, `tests/`
- **Target repository**: This POC repo (`POC_tauri-ux-separation`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and hook creation

- [x] T001 Create `src/hooks/useResizeObserver.ts` with resize observer hook implementation
- [x] T002 [P] Add CSS custom properties for transcript window in `tailwind.config.js` (transcript-min-height, transcript-height-ratio via theme extend)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core hook that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create `src/hooks/useAutoScroll.ts` with scroll detection and auto-scroll functionality (isLive state, scrollToBottom, threshold detection)
- [x] T004 Create `src/components/stitch/NewContentBadge.tsx` with floating badge component (count display, onClick handler, visibility, aria-live)
- [x] T005 [P] Add badge Tailwind styles to NewContentBadge component (positioning, animation, hover states)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View Latest Transcript Entry (Priority: P1) 🎯 Core

**Goal**: Telecommunicator always sees the most recent transcription text without manual scrolling

**Independent Test**: Generate multiple transcript entries and verify the most recent is always visible without user intervention

### Tests for User Story 1

- [x] T006 [P] [US1] Create test script `tests/test-transcript-scroll.mjs` - test auto-scroll triggers on new entries via WebSocket
- [x] T007 [P] [US1] Add test case for smooth scrolling (no jarring jumps) in `tests/test-transcript-scroll.mjs`

### Implementation for User Story 1

- [x] T008 [US1] Modify `src/components/stitch/TranscriptPanel.tsx` - integrate useAutoScroll hook
- [x] T009 [US1] Add auto-scroll trigger on entries prop change in `src/components/stitch/TranscriptPanel.tsx`
- [x] T010 [US1] Update `src/components/stitch/TranscriptPanel.tsx` - add scroll container styles with overflow-y: auto (implements FR-002: vertical scroll bar display)

**Checkpoint**: Auto-scroll to latest entry works. Story 1 testable independently.

---

## Phase 4: User Story 2 - Review Previous Transcript Content (Priority: P2)

**Goal**: User can scroll back through history while still being able to return to live feed

**Independent Test**: Scroll up through transcript, pause on entry, then trigger return to live view

### Tests for User Story 2

- [x] T011 [P] [US2] Add test case for scroll detection (user scrolls up pauses auto-scroll) in `tests/test-transcript-scroll.mjs`
- [x] T012 [P] [US2] Add test case for badge display (shows count when in review mode) in `tests/test-transcript-scroll.mjs`
- [x] T013 [P] [US2] Add test case for badge click (returns to live view) in `tests/test-transcript-scroll.mjs`

### Implementation for User Story 2

- [x] T014 [US2] Add newEntryCount state tracking in `src/components/stitch/TranscriptPanel.tsx`
- [x] T015 [US2] Integrate NewContentBadge component into TranscriptPanel in `src/components/stitch/TranscriptPanel.tsx`
- [x] T016 [US2] Implement badge click handler (scrollToBottom + reset count) in `src/components/stitch/TranscriptPanel.tsx`
- [x] T017 [US2] Add scroll-to-bottom detection for resuming auto-scroll in `src/hooks/useAutoScroll.ts`

**Checkpoint**: Review mode with badge indicator works. Stories 1 and 2 both testable independently.

---

## Phase 5: User Story 3 - Consistent Window Layout (Priority: P3)

**Goal**: Transcript window has predictable, fixed size (2:1 ratio with audio status window)

**Independent Test**: Resize browser/application and verify transcript window maintains proportional relationship

### Tests for User Story 3

- [x] T018 [P] [US3] Add test case for height calculation (2× audio status window) in `tests/test-transcript-scroll.mjs`
- [x] T019 [P] [US3] Add test case for resize handling (maintains ratio on window resize) in `tests/test-transcript-scroll.mjs`
- [x] T020 [P] [US3] Add test case for fallback height (200px when audio status unavailable) in `tests/test-transcript-scroll.mjs`

### Implementation for User Story 3

- [x] T021 [US3] Add audioStatusRef prop to TranscriptPanel in `src/components/stitch/TranscriptPanel.tsx`
- [x] T022 [US3] Implement ResizeObserver integration for dynamic height calculation in `src/components/stitch/TranscriptPanel.tsx`
- [x] T023 [US3] Add minHeight fallback logic (200px) when audioStatusRef unavailable in `src/components/stitch/TranscriptPanel.tsx`
- [x] T024 [US3] Update component styles for fixed height container in `src/components/stitch/TranscriptPanel.tsx`

**Checkpoint**: All user stories functional and independently testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: E2E tests, edge cases, and final validation

- [x] T025 [P] Add browser-based E2E validation steps to `specs/002-transcript-window/quickstart.md` Testing Checklist
- [x] T026 [P] Add rapid entry handling validation to quickstart.md Testing Checklist
- [x] T027 Add empty state handling (no entries) in `src/components/stitch/TranscriptPanel.tsx`
- [x] T028 Add long entry handling (text wrapping) via Tailwind classes in `src/components/stitch/TranscriptPanel.tsx`
- [x] T029 [P] Add manual test case for long entry text wrapping in quickstart.md (edge case: entry longer than window)
- [x] T030 [P] Add manual test case for rapid-fire entry batching in quickstart.md (edge case: multiple entries in <100ms)
- [x] T031 [P] Update component documentation in `src/components/stitch/README.md` (or add if missing)
- [x] T032 Run quickstart.md validation steps to confirm all acceptance criteria pass
- [x] T033 Validate auto-scroll performance meets 500ms target (SC-001) using browser performance tools

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - Can proceed sequentially (P1 → P2 → P3) or in parallel if staffed
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on T003 (useAutoScroll hook) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on T003, T004 (useAutoScroll + NewContentBadge) - Extends US1 but independently testable
- **User Story 3 (P3)**: Depends on T001 (useResizeObserver) - Fully independent of US1/US2

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Hook integration before state management
- State management before UI integration
- Commit after each task or logical group

### Parallel Opportunities

- T001, T002 can run in parallel (Setup phase)
- T004, T005 can run in parallel (Foundational phase)
- T006, T007 can run in parallel (US1 tests)
- T011, T012, T013 can run in parallel (US2 tests)
- T018, T019, T020 can run in parallel (US3 tests)
- T025, T026 can run in parallel (E2E tests)

---

## Parallel Example: User Story 2 Tests

```bash
# Launch all tests for User Story 2 together:
Task: "Test scroll detection in TranscriptWindow.test.tsx"
Task: "Test badge display in TranscriptWindow.test.tsx"
Task: "Test badge click in TranscriptWindow.test.tsx"
```

---

## Implementation Strategy

### Priority P1 First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: Foundational (T003-T005)
3. Complete Phase 3: User Story 1 (T006-T010)
4. **STOP and VALIDATE**: Test auto-scroll independently
5. Deploy/demo when production-ready - users can see latest entry

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. User Story 1 → Auto-scroll works → Demo P1 Core
3. User Story 2 → Review mode + badge → Demo
4. User Story 3 → Fixed height layout → Demo
5. Polish → E2E tests, edge cases → Release ready

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (auto-scroll core)
   - Developer B: User Story 3 (height/layout - independent)
3. User Story 2 builds on US1, can follow after
4. Polish phase for integration testing

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Target repository is separate from this docs repo
- Use quickstart.md as implementation reference
- Refer to research.md for technical decisions (scroll threshold, ResizeObserver, badge pattern)
