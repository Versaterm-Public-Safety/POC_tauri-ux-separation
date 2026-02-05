# Feature Specification: WebSocket Message Contract Compliance

**Feature Branch**: `001-spec-compliance`  
**Created**: 2026-02-04  
**Status**: Draft  
**Input**: User description: "Fix WebSocket message contract to match official specification for complete protocol compliance"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - BaseMessage Contract Foundation (Priority: P1)

As a system integrator, I need all WebSocket messages to have unique identifiers and timestamps so that I can track message flow, debug issues, and correlate frontend-backend communication.

**Why this priority**: This is the foundation for all other fixes. Without proper message tracking (messageId) and timing (ISO 8601 timestamps), debugging production issues is nearly impossible. This also enables the standardization of the payload wrapper.

**Independent Test**: Can be fully tested by capturing WebSocket messages in browser DevTools and verifying that all messages (both frontend→backend and backend→frontend) have `messageId` (UUID format) and `timestamp` (ISO 8601 string format). System functionality remains identical.

**Acceptance Scenarios**:

1. **Given** POC frontend is connected to backend, **When** user clicks "Start Call", **Then** the `call:start` message includes `messageId` (UUID) and `timestamp` (ISO 8601)
2. **Given** backend sends `connection:ack` message, **When** frontend receives it, **Then** message includes `messageId` and `timestamp` fields
3. **Given** any WebSocket message is sent, **When** inspected in logs, **Then** it uses `payload` wrapper (not `data`) consistently
4. **Given** multiple messages are sent, **When** messageIds are compared, **Then** all are unique UUIDs

---

### User Story 2 - Transcript Segment Tracking (Priority: P2)

As a quality assurance engineer, I need transcript segments to have unique IDs and call-relative timestamps so that I can precisely track which utterances were transcribed, when they occurred relative to call start, and correlate interim vs final segments.

**Why this priority**: Enables proper segment tracking and call timeline reconstruction. Critical for QA validation but doesn't block basic functionality.

**Independent Test**: Start a call, observe transcript streaming, verify each segment has `segmentId` (UUID), `startTime` (seconds since call start), and `endTime` (only when isFinal=true). Timeline should be monotonically increasing.

**Acceptance Scenarios**:

1. **Given** call is active, **When** backend sends interim transcript, **Then** segment includes `segmentId`, `startTime`, but NO `endTime`
2. **Given** call is active, **When** backend sends final transcript, **Then** segment includes `segmentId`, `startTime`, AND `endTime`
3. **Given** multiple segments from same speaker, **When** `startTime` values are compared, **Then** they increase monotonically
4. **Given** two different segments, **When** `segmentId` values are compared, **Then** they are unique UUIDs

---

### User Story 3 - Call Session Tracking (Priority: P3)

As a support engineer, I need each call to have a unique identifier that persists from active through ended state so that I can correlate all events for a specific call session, especially across reconnections.

**Why this priority**: Improves debuggability and session tracking. Less critical than message foundation but valuable for production support.

**Independent Test**: Start multiple sequential calls, verify each has a different `callId` that appears in `call:state` messages when state is 'active' or 'ended'.

**Acceptance Scenarios**:

1. **Given** call transitions to 'active', **When** `call:state` message is sent, **Then** it includes a unique `callId` (UUID)
2. **Given** call is active with callId=X, **When** call ends, **Then** `call:state` 'ended' message includes same callId=X
3. **Given** call ends and new call starts, **When** callIds are compared, **Then** they are different UUIDs
4. **Given** call is in 'idle' state, **When** `call:state` message is sent, **Then** `callId` field is absent or null

---

### User Story 4 - WebSocket Path Compliance (Priority: P4)

As a DevOps engineer, I need the WebSocket connection to use the `/tnt` path as specified so that routing rules and load balancers can properly route TnT traffic.

**Why this priority**: Minor compliance issue with low impact. Current implementation works without path, but spec compliance aids future deployment.

**Independent Test**: Connect frontend to backend, verify WebSocket URL includes `/tnt` path in DevTools Network tab.

**Acceptance Scenarios**:

1. **Given** frontend initializes WebSocket, **When** connection is established, **Then** URL is `ws://localhost:8080/tnt`
2. **Given** backend WebSocket server starts, **When** connection request arrives on `/tnt`, **Then** connection is accepted
3. **Given** backend receives connection on `/tnt`, **When** handshake completes, **Then** session is established normally

---

### Edge Cases

- What happens when messageId generation fails (UUID library unavailable)?
- How does system handle malformed ISO 8601 timestamps?
- What if segmentId collisions occur (extremely unlikely with UUIDs)?
- How are transcript segments deduplicated when segmentId is present but text changes?
- What happens to callId when connection drops and reconnects during active call?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: All WebSocket messages (frontend→backend and backend→frontend) MUST include a `messageId` field containing a UUID v4 string
- **FR-002**: All WebSocket messages MUST include a `timestamp` field containing an ISO 8601 formatted datetime string
- **FR-003**: All message payloads MUST use `payload` wrapper (not `data`) for consistency with specification
- **FR-004**: Transcript segments MUST include `segmentId` (UUID) to enable precise segment tracking
- **FR-005**: Transcript segments MUST include `startTime` (number of seconds since call start) for timeline reconstruction
- **FR-006**: Final transcript segments (isFinal=true) MUST include `endTime` (number of seconds since call start)
- **FR-007**: Call state messages with state 'active' or 'ended' MUST include `callId` (UUID) to track call sessions
- **FR-008**: WebSocket frontend MUST connect to `ws://localhost:8080/tnt` (including `/tnt` path)
- **FR-009**: UUID generation MUST use cryptographically secure random UUIDs (crypto.randomUUID() or equivalent)
- **FR-010**: ISO 8601 timestamps MUST be generated using standard Date.toISOString() method
- **FR-011**: All existing POC functionality MUST continue to work identically after changes
- **FR-012**: TypeScript compilation MUST succeed with no errors after all changes

### Key Entities *(include if feature involves data)*

- **BaseMessage**: All messages extend this structure
  - `type`: string (message type discriminator)
  - `timestamp`: string (ISO 8601)
  - `messageId`: string (UUID v4)

- **ClientMessage** (Frontend → Backend):
  - `call:start`: BaseMessage + type
  - `call:end`: BaseMessage + type
  - `ui:interaction`: BaseMessage + type + payload (UIInteraction)

- **ServerMessage** (Backend → Frontend):
  - `connection:ack`: BaseMessage + type + payload (sessionId)
  - `call:state`: BaseMessage + type + payload (state, callId?)
  - `language:detected`: BaseMessage + type + payload (speaker, languageCode, languageName, confidence)
  - `transcript:segment`: BaseMessage + type + payload (segmentId, speaker, text, isFinal, startTime, endTime?)
  - `audio:status`: BaseMessage + type + payload (caller/telecommunicator ChannelStatus) 
  - `ui:interaction:ack`: BaseMessage + type + payload (interactionId)

- **TranscriptSegmentPayload**:
  - `segmentId`: string (UUID, unique per segment)
  - `speaker`: 'caller' | 'telecommunicator'
  - `text`: string (transcript text)
  - `isFinal`: boolean (true = finalized, false = interim)
  - `startTime`: number (seconds since call start)
  - `endTime`?: number (only present when isFinal=true, seconds since call start)

- **CallStatePayload**:
  - `state`: 'idle' | 'connecting' | 'active' | 'ended'
  - `callId`?: string (UUID, present when state is 'active' or 'ended')

## Success Criteria *(mandatory)*

1. **Message Tracking**: 100% of WebSocket messages visible in DevTools include messageId and timestamp fields
2. **Format Compliance**: All timestamps are valid ISO 8601 strings (pass Date.parse() validation)
3. **UUID Uniqueness**: No duplicate messageIds or segmentIds observed in 100-message sample
4. **Wrapper Consistency**: All messages use `payload` wrapper; zero instances of `data` wrapper in codebase
5. **Timeline Accuracy**: Transcript startTime values increase monotonically for each speaker
6. **Call Correlation**: callId remains consistent from 'active' to 'ended' state for same call session
7. **Path Compliance**: WebSocket connection established on `/tnt` path (verified in Network tab)
8. **Zero Regression**: All existing POC features work identically (demo runbook passes without modification)
9. **Type Safety**: Zero TypeScript compilation errors in frontend and backend
10. **Deviation Resolution**: Updated deviation analysis shows 100% compliance with spec

## Assumptions *(mandatory)*

1. **UUID Library**: Modern JavaScript/TypeScript environment with crypto.randomUUID() available (Node 16.7+, all modern browsers)
2. **No Breaking Changes**: External systems (if any) not yet integrated, so message structure changes won't break integrations
3. **Single Backend**: Only one mock backend instance, so callId tracking doesn't need distributed coordination
4. **Development Environment**: Changes tested locally before deployment; no immediate production impact
5. **Spec Authority**: The official spec at https://github.com/Versaterm-Public-Safety/tnt-project-docs/blob/master/specs/meta/tauri-v2-ux-separation-poc.md is the source of truth
6. **Backward Compatibility**: Current deviation analysis assumes no external dependencies on current message format
7. **Test Methodology**: Manual validation via DevTools and log inspection is sufficient (no automated contract testing required for POC)

## Out of Scope *(optional - mark clearly)*

- **AudioStatus Structure Change**: Keeping current bundled structure (both channels in one message) rather than spec's per-channel messages - documented as intentional deviation with justification
- **Performance Optimization**: No need to optimize UUID generation or timestamp formatting for POC scale
- **Message Validation**: Not implementing JSON schema validation or message format validators
- **Backward Compatibility Layer**: Not supporting old message format; clean cutover only
- **Distributed Call Tracking**: callId tracking assumes single backend; distributed scenarios out of scope
- **Message Replay/Recovery**: Not implementing message retry or guaranteed delivery
- **Contract Testing**: Not implementing automated contract tests (manual validation sufficient for POC)
- **[Entity 2]**: [What it represents, relationships to other entities]

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: [Measurable metric, e.g., "Users can complete account creation in under 2 minutes"]
- **SC-002**: [Measurable metric, e.g., "System handles 1000 concurrent users without degradation"]
- **SC-003**: [User satisfaction metric, e.g., "90% of users successfully complete primary task on first attempt"]
- **SC-004**: [Business metric, e.g., "Reduce support tickets related to [X] by 50%"]
