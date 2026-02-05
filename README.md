# TnT UX POC - Tauri v2 + React

> **Proof of Concept**: Clean separation between Tauri v2 + React frontend and Docker-based mock backend for the Translation & Transcription (TnT) system.

## 📋 Architecture Specification

This implementation follows the official architecture spec:
**[Tauri v2 UX Separation POC](https://github.com/Versaterm-Public-Safety/tnt-project-docs/blob/master/specs/meta/tauri-v2-ux-separation-poc.md)**

## 🎯 Project Goals

This POC validates that:

1. ✅ The TnT frontend can be developed independently of the backend
2. ✅ AI-generated components (via Google Stitch + shadcn/Tailwind) can be swapped with human-designed components
3. ✅ The same React app works in both Tauri desktop and browser environments
4. ✅ All UI interactions are logged to the backend for validation

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│   Tauri Desktop Shell (Rust)       │
│   ┌─────────────────────────────┐   │
│   │  React Frontend (TypeScript) │   │
│   │  • Zustand State Management  │   │
│   │  • WebSocket Communication   │   │
│   │  • Tailwind CSS + shadcn/ui  │   │
│   └─────────────────────────────┘   │
└─────────────────────────────────────┘
              ↕ WebSocket
┌─────────────────────────────────────┐
│   Docker Backend (Node.js + TS)     │
│   • Mock Conversation Script        │
│   • Interaction Logging (JSONL)     │
│   • Spanish-speaking Caller Demo    │
└─────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ (for frontend and backend)
- **Rust** (for Tauri - [install from rustup.rs](https://rustup.rs/))
- **Docker** (for backend - optional, can run backend with Node.js directly)

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Start Backend (Choose one method)

#### Option A: Docker (Recommended)
```bash
cd backend
docker-compose up --build
```

#### Option B: Node.js (Direct)
```bash
cd backend
npm install
npm run dev
```

Backend will start on `ws://localhost:8080`

### 3. Run Frontend

#### Browser Mode
```bash
npm run dev
```
Open http://localhost:1420

#### Desktop Mode (Tauri)
```bash
npm run tauri:dev
```

## 📖 Documentation

- **[Component Replacement Guide](docs/component-replacement-guide.md)** - For UX team: How to swap AI-generated components
- **[Figma-to-Code Strategy Guide](docs/figma-to-code-strategy-guide.md)** - Comparison of Figma export tools
- **[Demo Runbook](docs/demo-runbook.md)** - Step-by-step demo instructions

## 🎨 Design System

Based on Versaterm brand guidelines (www.versaterm.com):

- **Primary Colors**: Professional blues (`#1e3a5f`, `#2563eb`)
- **Accent Color**: Trust green (`#059669`)
- **Error Color**: Alert red (`#dc2626`)
- **Philosophy**: Clean, modern, accessible design with high contrast for mission-critical readability

## 🔄 WebSocket Interface Contract

### Frontend → Backend

- `call:start` - User pressed Start Call
- `call:end` - User pressed End Call
- `ui:interaction` - Any UI interaction (for logging)

### Backend → Frontend

- `connection:ack` - Connection established
- `call:state` - Call state changes (idle/connecting/active/ended)
- `language:detected` - Language detection with confidence
- `transcript:segment` - Real-time transcript (interim and final)
- `audio:status` - Audio stream status per channel
- `ui:interaction:ack` - Confirms interaction was logged

See `src/types/messages.ts` for complete type definitions.

## 📁 Project Structure

```
POC_tauri-ux-separation/
├── src/                         # React frontend
│   ├── components/
│   │   ├── stitch/              # ⚡ AI-generated swappable components
│   │   │   ├── LanguageBadge.tsx
│   │   │   ├── TranscriptPanel.tsx
│   │   │   ├── ControlPanel.tsx
│   │   │   ├── AudioStatusIndicator.tsx
│   │   │   └── NotificationToast.tsx
│   │   └── layout/
│   │       └── AppShell.tsx
│   ├── hooks/
│   │   ├── useWebSocket.ts
│   │   └── useInteractionTracker.ts
│   ├── store/
│   │   └── callStore.ts         # Zustand state management
│   └── types/
│       └── messages.ts          # Interface contract
├── src-tauri/                   # Tauri desktop shell
├── backend/                     # Docker mock backend
└── docs/                        # Documentation
```

## 🧪 Testing the Demo

1. **Start Backend**: Run Docker container or Node.js server
2. **Start Frontend**: Run in browser (`npm run dev`) or desktop (`npm run tauri:dev`)
3. **Click "Start Call"**: Initiates mock Spanish-speaking caller scenario
4. **Observe**:
   - Language badges show Spanish (caller) and English (telecommunicator)
   - Two-speaker transcript displays in chat format
   - Audio status indicators show streaming levels
   - Toast notifications confirm actions
5. **Click "End Call"**: Stops the simulation
6. **Check Logs**: `backend/logs/interactions.jsonl` contains all UI interactions

## 🔧 Development

### Build for Production

```bash
# Frontend
npm run build

# Tauri Desktop App
npm run tauri:build

# Backend Docker Image
cd backend
docker build -t tnt-backend-mock .
```

### Component Development

All components in `src/components/stitch/` are designed to be **swappable**. See [Component Replacement Guide](docs/component-replacement-guide.md) for details.

## 📊 Success Criteria

- [x] `npm run dev` serves React app in browser
- [x] `npm run tauri:dev` launches desktop app
- [x] Both connect to Docker backend
- [x] "Start Call" initiates mock conversation
- [x] Language detection badge shows Spanish with confidence
- [x] Two-speaker transcript displays correctly
- [x] All interactions logged to backend
- [x] Component swap works without backend changes

## 🤝 Contributing

This is a proof of concept for internal evaluation. See documentation guides for:
- **UX Iteration Team**: How to swap AI components with human designs
- **Figma Workflow Team**: Testbed for Figma-to-code strategies

## 📄 License

Internal Versaterm POC - Not for public distribution

## 🔗 References

- TnT Track B documentation defines Browser UI Interface
- Tauri v2 is preferred desktop shell per Design System Alignment meeting
- Versaterm Design Systems team uses shadcn + Tailwind CSS
- This POC supports B1 milestone by validating UX separation architecture
