# Tasks: WebSocket Message Contract Compliance

**Input**: Design documents from `/specs/001-spec-compliance/`
**Prerequisites**: plan.md ✅, spec.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `src/` (frontend), `backend/src/` (backend)
- All file paths are absolute from repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare for message contract changes

- [ ] T001 Create git branch `fix/spec-compliance` from `001-spec-compliance` for incremental commits
- [ ] T002 Create backup of current message contract files (src/types/messages.ts, backend/src/types.ts)
- [ ] T003 [P] Document current message examples by capturing WebSocket traffic in DevTools

**Checkpoint**: Branch ready, baseline captured

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Create UUID generation utility function in src/utils/uuid.ts (export `generateUUID()` using crypto.randomUUID())
- [ ] T005 Create ISO 8601 timestamp utility function in src/utils/timestamp.ts (export `generateTimestamp()` using Date.toISOString())
- [ ] T006 Create same utilities in backend/src/utils/uuid.ts
- [ ] T007 Create same utilities in backend/src/utils/timestamp.ts

**Checkpoint**: Utility functions ready - user story implementation can now begin

---

## Phase 3: User Story 1 - BaseMessage Contract Foundation (Priority: P1) 🎯 MVP

**Goal**: All WebSocket messages have messageId (UUID) and timestamp (ISO 8601) fields, using consistent `payload` wrapper

**Independent Test**: Capture WebSocket messages in browser DevTools Network tab, verify all messages have `messageId` and `timestamp` fields in correct format, and all use `payload` not `data`

### Implementation for User Story 1

#### Frontend Type Updates

- [ ] T010 [P] [US1] Add BaseMessage interface to src/types/messages.ts (type, messageId: string, timestamp: string)
- [ ] T011 [US1] Update ClientMessage types to extend BaseMessage in src/types/messages.ts
- [ ] T012 [US1] Rename all `data` properties to `payload` in src/types/messages.ts (10 changes)
- [ ] T013 [US1] Update ServerMessage types to extend BaseMessage in src/types/messages.ts
- [ ] T014 [US1] Rename all `data` properties to `payload` in ServerMessage types in src/types/messages.ts

#### Backend Type Updates

- [ ] T015 [P] [US1] Add BaseMessage interface to backend/src/types.ts (mirror frontend)
- [ ] T016 [US1] Update ClientMessage types to extend BaseMessage in backend/src/types.ts
- [ ] T017 [US1] Rename all `data` properties to `payload` in backend/src/types.ts
- [ ] T018 [US1] Update ServerMessage types to extend BaseMessage in backend/src/types.ts

#### Frontend Implementation

- [ ] T020 [US1] Update useWebSocket.ts sendMessage() to add messageId and timestamp to outgoing messages
- [ ] T021 [US1] Update all message handlers in useWebSocket.ts to use `message.payload` instead of `message.data` (6 handler changes)
- [ ] T022 [US1] Update callStore.ts actions to use `payload` instead of `data` if directly accessing message fields
- [ ] T023 [US1] Update useInteractionTracker.ts to use `payload` wrapper

#### Backend Implementation

- [ ] T025 [US1] Create helper function `createServerMessage(type, payload)` in backend/src/server.ts that adds messageId and timestamp
- [ ] T026 [US1] Update connection:ack message construction to use createServerMessage() and `payload` wrapper in backend/src/server.ts
- [ ] T027 [US1] Update call:state message construction to use createServerMessage() and `payload` wrapper in backend/src/server.ts
- [ ] T028 [US1] Update language:detected message construction to use createServerMessage() and `payload` wrapper in backend/src/server.ts
- [ ] T029 [US1] Update transcript:segment message construction to use createServerMessage() and `payload` wrapper in backend/src/server.ts (placeholder, will enhance in US2)
- [ ] T030 [US1] Update audio:status message construction to use createServerMessage() and `payload` wrapper in backend/src/server.ts
- [ ] T031 [US1] Update ui:interaction:ack message construction to use createServerMessage() and `payload` wrapper in backend/src/server.ts
- [ ] T032 [US1] Update handleCallStart() to access message fields via `payload` in backend/src/server.ts
- [ ] T033 [US1] Update handleCallEnd() to access message fields via `payload` in backend/src/server.ts
- [ ] T034 [US1] Update ui:interaction handler to access message.data via `message.payload` in backend/src/server.ts

#### Validation

- [ ] T040 [US1] Run TypeScript compilation for frontend (npm run build should succeed with zero errors)
- [ ] T041 [US1] Run TypeScript compilation for backend (cd backend && npm run build should succeed)
- [ ] T042 [US1] Start backend (docker-compose up) and verify it starts without errors
- [ ] T043 [US1] Start frontend in browser mode (npm run dev) and verify WebSocket connects
- [ ] T044 [US1] Click "Start Call" and capture WebSocket messages in DevTools Network tab
- [ ] T045 [US1] Verify call:start message has messageId (UUID format) and timestamp (ISO 8601 format)
- [ ] T046 [US1] Verify all backend messages (connection:ack, call:state, etc.) have messageId and timestamp
- [ ] T047 [US1] Verify all messages use `payload` wrapper (search codebase for `message.data` should find zero results)
- [ ] T048 [US1] Verify all existing POC features work (language badges, transcript, call controls)
- [ ] T049 [US1] Test in Tauri desktop mode (npm run tauri:dev) and verify identical behavior
- [ ] T050 [US1] Commit changes with message "feat(messages): add BaseMessage with messageId and timestamp"

**Checkpoint**: At this point, all messages have tracking IDs and timestamps. User Story 1 is complete and independently testable.

---

## Phase 4: User Story 2 - Transcript Segment Tracking (Priority: P2)

**Goal**: Transcript segments have unique IDs and call-relative timestamps for precise tracking

**Independent Test**: Start a call, observe transcript streaming in DevTools, verify each segment has `segmentId` (UUID), `startTime` (increasing numbers), and `endTime` (only when isFinal=true)

### Implementation for User Story 2

#### Type Updates

- [ ] T060 [P] [US2] Update TranscriptSegment interface in src/types/messages.ts to add `segmentId: string`
- [ ] T061 [P] [US2] Update TranscriptSegment interface in src/types/messages.ts to add `startTime: number`
- [ ] T062 [P] [US2] Update TranscriptSegment interface in src/types/messages.ts to add `endTime?: number`
- [ ] T063 [P] [US2] Mirror changes in backend/src/types.ts TranscriptSegment interface

#### Backend Implementation

- [ ] T065 [US2] Add `callStartTime: number | null` to ClientSession interface in backend/src/server.ts
- [ ] T066 [US2] Set `session.callStartTime = Date.now()` in handleCallStart() in backend/src/server.ts
- [ ] T067 [US2] Clear `session.callStartTime = null` in handleCallEnd() in backend/src/server.ts
- [ ] T068 [US2] Update mockConversation.ts to generate `segmentId` (UUID) for each transcript segment
- [ ] T069 [US2] Update mockConversation.ts to calculate `startTime` as `(Date.now() - callStartTime) / 1000` (seconds)
- [ ] T070 [US2] Update mockConversation.ts to set `endTime` only when `isFinal: true`
- [ ] T071 [US2] Update sendTranscriptSegment() helper to include new fields in payload

#### Frontend Updates (Optional)

- [ ] T075 [US2] Review TranscriptPanel.tsx to see if startTime should be displayed (decision: not needed for POC)
- [ ] T076 [US2] Verify callStore.ts addTranscript() handles new fields correctly (should pass through unchanged)

#### Validation

- [ ] T080 [US2] Run TypeScript compilation (frontend and backend should succeed)
- [ ] T081 [US2] Start backend and frontend
- [ ] T082 [US2] Start a call and capture transcript messages in DevTools
- [ ] T083 [US2] Verify each transcript segment has unique `segmentId` (UUID format)
- [ ] T084 [US2] Verify `startTime` values increase monotonically for each speaker
- [ ] T085 [US2] Verify interim segments (isFinal=false) do NOT have `endTime`
- [ ] T086 [US2] Verify final segments (isFinal=true) DO have `endTime`
- [ ] T087 [US2] Verify transcript display still works correctly in TranscriptPanel
- [ ] T088 [US2] Verify interim/final deduplication still works as expected
- [ ] T089 [US2] Commit changes with message "feat(transcript): add segmentId and call-relative timing"

**Checkpoint**: Transcript segments have precise tracking and timeline. User Story 2 is complete and independently testable.

---

## Phase 5: User Story 3 - Call Session Tracking (Priority: P3)

**Goal**: Each call has a unique identifier that persists from active through ended state

**Independent Test**: Start multiple sequential calls, verify each has different `callId` that appears in 'active' and 'ended' state messages

### Implementation for User Story 3

#### Type Updates

- [ ] T100 [P] [US3] Update CallStateData interface in src/types/messages.ts to add `callId?: string`
- [ ] T101 [P] [US3] Mirror change in backend/src/types.ts CallStateData interface

#### Backend Implementation

- [ ] T105 [US3] Add `activeCallId: string | null` to ClientSession interface in backend/src/server.ts
- [ ] T106 [US3] Generate `session.activeCallId = generateUUID()` when transitioning to 'active' state in handleCallStart()
- [ ] T107 [US3] Include `callId: session.activeCallId` in call:state payload when state is 'active' in backend/src/server.ts
- [ ] T108 [US3] Include `callId: session.activeCallId` in call:state payload when state is 'ended' in handleCallEnd()
- [ ] T109 [US3] Clear `session.activeCallId = null` after sending 'ended' state in handleCallEnd()
- [ ] T110 [US3] Ensure 'idle' and 'connecting' states do NOT include callId

#### Frontend Updates

- [ ] T115 [US3] Add `callId: string | null` to callStore.ts state
- [ ] T116 [US3] Update setCallState() action in callStore.ts to accept optional callId parameter
- [ ] T117 [US3] Store callId when state is 'active' in callStore.ts
- [ ] T118 [US3] Clear callId when state returns to 'idle' in callStore.ts
- [ ] T119 [US3] Update useWebSocket.ts call:state handler to pass callId to setCallState()

#### Validation

- [ ] T120 [US3] Run TypeScript compilation (frontend and backend should succeed)
- [ ] T121 [US3] Start backend and frontend
- [ ] T122 [US3] Start a call and capture call:state messages for 'active' state
- [ ] T123 [US3] Verify 'active' state message includes unique `callId` (UUID format)
- [ ] T124 [US3] End the call and verify 'ended' state message has same `callId`
- [ ] T125 [US3] Start a second call and verify it has different `callId`
- [ ] T126 [US3] Verify 'idle' and 'connecting' states do NOT include callId field
- [ ] T127 [US3] Verify callStore.callId is set/cleared correctly
- [ ] T128 [US3] Commit changes with message "feat(call): add callId session tracking"

**Checkpoint**: Call sessions have unique tracking IDs. User Story 3 is complete and independently testable.

---

## Phase 6: User Story 4 - WebSocket Path Compliance (Priority: P4)

**Goal**: WebSocket connects on `/tnt` path as specified

**Independent Test**: Verify WebSocket URL in DevTools Network tab shows `ws://localhost:8080/tnt`

### Implementation for User Story 4

#### Frontend Updates

- [ ] T140 [P] [US4] Update WS_URL constant in src/hooks/useWebSocket.ts to `ws://localhost:8080/tnt`

#### Backend Updates (Optional)

- [ ] T145 [US4] Add path validation comment in backend/src/server.ts noting `/tnt` path expectation (optional, backend currently accepts all paths)

#### Validation

- [ ] T150 [US4] Start backend and frontend
- [ ] T151 [US4] Check DevTools Network tab → WS tab → verify connection URL is `ws://localhost:8080/tnt`
- [ ] T152 [US4] Verify connection establishes successfully
- [ ] T153 [US4] Verify all functionality works identically
- [ ] T154 [US4] Commit changes with message "fix(websocket): use /tnt path per specification"

**Checkpoint**: WebSocket path matches specification. User Story 4 is complete.

---

## Phase 7: Final Polish & Documentation

**Purpose**: Complete validation, update documentation, verify 100% compliance

### Comprehensive Testing

- [ ] T200 Follow demo runbook (docs/demo-runbook.md) step-by-step to verify all POC features work
- [ ] T201 Test in browser mode (npm run dev on http://localhost:1420)
- [ ] T202 Test in Tauri desktop mode (npm run tauri:dev)
- [ ] T203 Verify component swappability still works (replace one component from src/components/stitch/)
- [ ] T204 Capture full WebSocket conversation in DevTools and validate all message structures
- [ ] T205 Check backend logs (backend/logs/interactions.jsonl) for proper interaction logging

### Message Contract Validation

- [ ] T210 Verify 100% of messages have `messageId` field (UUID v4 format)
- [ ] T211 Verify 100% of messages have `timestamp` field (ISO 8601 format)
- [ ] T212 Verify all messageIds are unique (no duplicates in 100-message sample)
- [ ] T213 Verify all timestamps are valid (pass Date.parse() validation)
- [ ] T214 Search codebase for `message.data` - should return zero results
- [ ] T215 Search codebase for `payload` wrapper - should find all message accesses
- [ ] T216 Verify transcript segments have segmentId, startTime, endTime fields
- [ ] T217 Verify call states have callId when appropriate
- [ ] T218 Verify WebSocket URL uses `/tnt` path

### Documentation Updates

- [ ] T220 Update .github/copilot-instructions.md with new message contract structure
- [ ] T221 Add example messages with messageId/timestamp to copilot-instructions.md
- [ ] T222 Update docs/component-replacement-guide.md if any component props changed
- [ ] T223 Verify docs/demo-runbook.md still accurate (update if needed)
- [ ] T224 Create deviation-compliance-update.md showing before/after compliance percentages

### Compliance Verification

- [ ] T230 Re-run deviation analysis comparison against spec
- [ ] T231 Update session deviation-analysis.md with new compliance status (should be ~95%, AudioStatus intentionally different)
- [ ] T232 Document intentional AudioStatus deviation in README or compliance doc
- [ ] T233 Create compliance badge/status section in README

### Final Checks

- [ ] T240 Run `npm run build` (frontend build must succeed)
- [ ] T241 Run `npm run tauri:build` (desktop build must succeed)
- [ ] T242 Run `cd backend && npm run build` (backend build must succeed)
- [ ] T243 Verify zero TypeScript compilation errors
- [ ] T244 Verify zero runtime errors in browser console
- [ ] T245 Verify zero errors in backend logs

### Merge Preparation

- [ ] T250 Merge all incremental commits from fix/spec-compliance into single cohesive commit message
- [ ] T251 Create pull request description summarizing all changes
- [ ] T252 Add before/after examples of message structures to PR description
- [ ] T253 Document tested scenarios in PR description
- [ ] T254 Tag reviewers and request spec compliance verification

---

## Summary

**Total Tasks**: 144
**Parallelizable Tasks**: 15 (marked with [P])

### Task Count by User Story

- **Setup (Phase 1)**: 3 tasks
- **Foundational (Phase 2)**: 4 tasks
- **US1 - BaseMessage** (Phase 3): 41 tasks (MVP - delivers message tracking)
- **US2 - Transcript Tracking** (Phase 4): 15 tasks
- **US3 - Call Tracking** (Phase 5): 15 tasks
- **US4 - Path Compliance** (Phase 6): 6 tasks
- **Final Polish** (Phase 7): 35 tasks

### Independent Test Criteria

Each user story can be verified independently:
- **US1**: Capture messages in DevTools → verify messageId/timestamp/payload
- **US2**: Observe transcript → verify segmentId/startTime/endTime
- **US3**: Multiple calls → verify unique callIds
- **US4**: Check Network tab → verify /tnt path

### Suggested MVP Scope

**Minimum Viable Product**: User Story 1 only (BaseMessage Foundation)
- Delivers immediate value: message tracking and debugging capability
- Enables all other stories but provides standalone benefit
- Estimated effort: ~2-3 hours

### Implementation Notes

1. **Commit strategy**: Commit after each user story completion for rollback safety
2. **Testing cadence**: Validate after each user story before proceeding
3. **Parallel opportunities**: Frontend and backend type updates can be done simultaneously
4. **Risk mitigation**: Incremental changes minimize breaking change risk

---

## Dependencies

```
Setup (Phase 1)
  ↓
Foundational (Phase 2) ← BLOCKING: Must complete before user stories
  ↓
  ├─→ US1 (BaseMessage) ← BLOCKING for US2, US3
  │     ↓
  │     ├─→ US2 (Transcript) ← Independent
  │     ├─→ US3 (CallId) ← Independent
  │     └─→ US4 (Path) ← Independent
  ↓
Final Polish (Phase 7) ← After all user stories complete
```

### Parallel Execution Opportunities

**After Foundational Phase**:
- Frontend and backend type updates can happen simultaneously (different developers)
- Within each user story, type definitions ([P] tasks) can be done in parallel

**After US1 Complete**:
- US2, US3, and US4 are independent - can be implemented in any order or in parallel

**Within Each Story**:
- Type updates for frontend and backend are parallelizable
- Validation tasks can partially overlap if multiple testers available
