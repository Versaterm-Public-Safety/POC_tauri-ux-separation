# TnT UX POC - Copilot Instructions

This is a **proof-of-concept** for the Translation & Transcription (TnT) system, demonstrating clean separation between a Tauri v2 + React frontend and a Docker-based mock backend.

## Build, Test, and Run Commands

### Frontend
```bash
npm install              # Install dependencies
npm run dev              # Browser mode (http://localhost:1420)
npm run tauri:dev        # Desktop mode (Tauri)
npm run build            # Production build
npm run tauri:build      # Build desktop app
```

### Backend
```bash
# Option 1: Docker (Recommended)
cd backend && docker-compose up --build

# Option 2: Direct Node.js
cd backend && npm install && npm run dev
```

Backend runs on `ws://localhost:8080`

## Architecture Overview

### Three-Layer System
1. **Tauri Desktop Shell** (Rust) - Optional wrapper around React app
2. **React Frontend** (TypeScript) - UI layer with Zustand state management
3. **Mock Backend** (Node.js + WebSocket) - Simulated conversation server

### Critical Separation: The "Stitch Line"
Components in `src/components/stitch/` are **AI-generated and swappable**. The UX team can replace these with human-designed components without touching:
- State management (`src/store/callStore.ts`)
- WebSocket communication (`src/hooks/useWebSocket.ts`)
- Type contracts (`src/types/messages.ts`)
- Backend code

**Key Rule**: When modifying components in `stitch/`, maintain the existing props interface. Implementation can change completely; the interface must stay stable.

### WebSocket Interface Contract
All communication between frontend and backend flows through typed messages defined in `src/types/messages.ts`:

**Frontend → Backend:**
- `call:start` - User initiated call
- `call:end` - User ended call  
- `ui:interaction` - Logs any UI interaction (button clicks, etc.)

**Backend → Frontend:**
- `connection:ack` - Connection established with sessionId
- `call:state` - State changes (idle/connecting/active/ended)
- `language:detected` - Language detection results per speaker
- `transcript:segment` - Real-time transcript (interim or final)
- `audio:status` - Audio stream status for both channels
- `ui:interaction:ack` - Confirms interaction was logged

**When modifying communication**: Update type definitions in `messages.ts` first, then update both frontend handlers (useWebSocket.ts) and backend implementation.

## Key Conventions

### State Management Pattern
Uses Zustand with a single centralized store (`callStore.ts`). All WebSocket messages update state through store actions, never directly mutating state in components.

**Pattern**:
```typescript
// In useWebSocket.ts - message handler
case 'language:detected':
  setLanguageDetection(message.data);  // Store action
  break;

// In component
const callerLanguage = useCallStore(state => state.callerLanguage);
```

### Component Organization
```
src/components/
├── stitch/              # AI-generated, swappable components (5 files)
│   ├── LanguageBadge.tsx
│   ├── TranscriptPanel.tsx
│   ├── ControlPanel.tsx
│   ├── AudioStatusIndicator.tsx
│   └── NotificationToast.tsx
└── layout/              # Structural components (not swappable)
    └── AppShell.tsx
```

### Transcript Handling
Transcripts use a deduplication pattern for interim vs final segments:
- **Interim transcripts** (isFinal: false): Replace previous interim from same speaker
- **Final transcripts** (isFinal: true): Append to history permanently

See `callStore.ts` `addTranscript` action for implementation.

### Versaterm Design System
- **Primary**: Professional blues (`#1e3a5f`, `#2563eb`)
- **Accent**: Trust green (`#059669`) for success/confirmed states
- **Error**: Alert red (`#dc2626`)
- **Philosophy**: High contrast for mission-critical readability, clean modern design
- Uses Tailwind CSS + shadcn/ui conventions

### Dual-Environment Support
Same React app runs in:
1. Browser (via Vite dev server on port 1420)
2. Tauri desktop shell (native window)

**No environment-specific code** - WebSocket connection works identically in both.

### Logging and Validation
All UI interactions are logged to `backend/logs/interactions.jsonl` for validation. The `useInteractionTracker` hook automatically tracks component interactions.

## Important Notes

- The backend uses a **mock conversation script** (Spanish-speaking caller scenario) - it's not a real transcription service
- Demo runbook in `docs/demo-runbook.md` provides step-by-step testing instructions
- Component replacement guide in `docs/component-replacement-guide.md` details exact props interfaces
- This POC validates B1 milestone: "Frontend can be developed independently of backend"
