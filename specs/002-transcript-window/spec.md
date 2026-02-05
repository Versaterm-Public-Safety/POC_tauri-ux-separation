# Feature Specification: Transcript Window Fixed Height with Auto-Scroll

**Feature Branch**: `002-transcript-window`  
**Created**: 2026-02-05  
**Status**: Draft  
**Input**: User description: "Modify the transcript window next to the audio status window. Make the window fixed height, twice that of the audio status window, and add a scroll bar so that we can always see the last response in the window at all times"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Latest Transcript Entry (Priority: P1)

As a telecommunicator monitoring a live 911 call, I need to always see the most recent transcription text so that I can follow the conversation in real-time without manually scrolling.

**Why this priority**: This is the core functionality - during an emergency call, the operator cannot afford to miss the latest spoken content. Automatic visibility of new entries is critical for situational awareness.

**Independent Test**: Can be fully tested by generating multiple transcript entries and verifying the most recent entry is always visible without user intervention.

**Acceptance Scenarios**:

1. **Given** a transcript window displaying conversation text, **When** a new transcription entry is added, **Then** the window automatically scrolls to display the newest entry at the bottom of the visible area
2. **Given** the transcript window has scrolled to show the latest entry, **When** the user is not interacting with the window, **Then** the scroll position remains at the bottom showing the latest content
3. **Given** multiple rapid transcript entries arrive, **When** entries are added faster than reading speed, **Then** the window smoothly scrolls to keep the latest entry visible without jarring jumps

---

### User Story 2 - Review Previous Transcript Content (Priority: P2)

As a telecommunicator, I need to scroll back through the transcript history to review something the caller said earlier, while still being able to return to the live feed.

**Why this priority**: Operators occasionally need to verify details (addresses, names, descriptions) mentioned earlier in the call. This supports accurate information capture.

**Independent Test**: Can be tested by scrolling up through transcript history, pausing on an entry, then triggering return to live view.

**Acceptance Scenarios**:

1. **Given** a transcript window with multiple entries, **When** the user scrolls upward manually, **Then** the auto-scroll behavior pauses to allow reading historical content
2. **Given** the user has scrolled up to review history, **When** the user scrolls back to the bottom or clicks a "return to live" indicator, **Then** auto-scroll resumes and the latest entry is displayed
3. **Given** the user is reviewing historical content, **When** new entries arrive, **Then** a floating badge appears at the bottom showing the count of new entries (e.g., "3 new") without forcing the view to jump

---

### User Story 3 - Consistent Window Layout (Priority: P3)

As a telecommunicator, I need the transcript window to have a predictable, fixed size relative to the audio status window so that my workspace layout remains stable during calls.

**Why this priority**: Visual consistency reduces cognitive load during high-stress situations. A stable layout means operators don't need to adjust windows during emergencies.

**Independent Test**: Can be tested by resizing the browser/application and verifying the transcript window maintains its proportional relationship to the audio status window.

**Acceptance Scenarios**:

1. **Given** the transcript window and audio status window are both visible, **When** the interface loads, **Then** the transcript window height is exactly twice the height of the audio status window
2. **Given** the application window is resized, **When** the layout adjusts, **Then** the transcript window maintains its 2:1 height ratio relative to the audio status window
3. **Given** the fixed height transcript window, **When** content exceeds the visible area, **Then** a vertical scroll bar appears to indicate more content is available

---

### Edge Cases

- What happens when the transcript window contains no entries? The window displays an empty state with appropriate placeholder text and no scroll bar.
- What happens when a single transcript entry is longer than the visible window height? The entry wraps within the window and the scroll bar allows viewing the complete entry.
- How does the system handle rapid-fire entries (e.g., multiple speakers talking simultaneously)? Entries are displayed in chronological order and auto-scroll remains smooth, batching visual updates if necessary.
- What happens if the audio status window is hidden or removed? The transcript window uses a fixed minimum height (e.g., 200px) to ensure usability regardless of the audio status window state.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Transcript window MUST have a fixed height equal to exactly twice the height of the audio status window
- **FR-002**: Transcript window MUST display a vertical scroll bar when content exceeds the visible area
- **FR-003**: Transcript window MUST automatically scroll to show the newest entry when new content is added (auto-scroll behavior)
- **FR-004**: System MUST pause auto-scroll when the user manually scrolls upward to review previous content
- **FR-005**: System MUST display a floating badge/pill at the bottom of the transcript window showing the count of new entries (e.g., "3 new") when the user has scrolled away from the live view; clicking the badge returns to live view
- **FR-006**: System MUST resume auto-scroll when the user scrolls to the bottom of the content or activates a "return to live" control
- **FR-007**: Transcript window MUST maintain the 2:1 height ratio with the audio status window when the application is resized
- **FR-008**: Auto-scroll MUST be smooth and not cause jarring visual jumps when new entries arrive rapidly
- **FR-009**: When the audio status window is unavailable, transcript window MUST use a fixed minimum height to ensure usability

### Key Entities

- **Transcript Entry**: Individual transcribed text segment with timestamp and speaker identification; displayed chronologically in the transcript window
- **Audio Status Window**: Reference UI component that determines the base height for the transcript window; displays current audio/call status
- **Scroll Position State**: Tracks whether user is in "live" mode (auto-scroll active) or "review" mode (manual scroll position preserved)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can see the latest transcript entry within 500ms of it being generated without any manual interaction
- **SC-002**: Users can scroll back through transcript history and read previous entries without the view jumping to new content
- **SC-003**: The transcript window height remains exactly 2x the audio status window height across all supported screen sizes and resolutions
- **SC-004**: 100% of new transcript entries are visible to users who have not scrolled away from the live view
- **SC-005**: Users can return to live auto-scroll view with a single action (scroll to bottom or click indicator)

## Assumptions

- The audio status window has a defined, measurable height that serves as the reference for the transcript window sizing
- The transcript window is positioned adjacent to (next to) the audio status window in the current UI layout
- Transcript entries are text-based and arrive sequentially in chronological order
- The existing UI framework supports fixed-height containers and scroll behavior customization
- Speaker diarization (identifying who is speaking) is handled by a separate system; this spec only addresses display behavior
