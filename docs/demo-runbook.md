# Demo Runbook

> **Step-by-step instructions** for demonstrating the TnT UX POC

## 🎯 Demo Purpose

Show that:
1. Frontend and backend are completely separated
2. AI-generated components can be swapped without backend changes
3. Same React app works in browser and Tauri desktop
4. All interactions are logged for validation

## 👥 Audience

- **UX Iteration Team**: Focus on component swappability
- **Figma Workflow Team**: Focus on design-to-code process
- **Architecture Team**: Focus on interface contracts and separation

## ⏱️ Duration

- **Quick Demo**: 5 minutes
- **Full Demo**: 15 minutes
- **With Q&A**: 30 minutes

---

## 🚀 Setup (Before Demo)

### 1. System Check

Ensure you have:
- ✅ Node.js 20+ installed
- ✅ Docker installed (or Node.js for backend)
- ✅ Rust + Tauri CLI installed (for desktop demo)
- ✅ Repository cloned and dependencies installed

```bash
# Clone repository
git clone [repository-url]
cd POC_tauri-ux-separation

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Start Backend

**Option A: Docker (Recommended)**
```bash
cd backend
docker-compose up --build -d
cd ..
```

**Option B: Node.js Direct**
```bash
cd backend
npm run dev &
cd ..
```

Verify backend is running:
```bash
# Should see "WebSocket server started on port 8080"
curl http://localhost:8080
# Connection will be refused (expected - it's WebSocket only)
```

### 3. Open Code Editor

Have these files visible:
- `src/components/stitch/LanguageBadge.tsx` (example swappable component)
- `src/types/messages.ts` (interface contract)
- `backend/logs/interactions.jsonl` (will show logs during demo)

---

## 📝 Demo Script

### Part 1: Browser Mode (3 minutes)

**Talking Points**:
> "Let's start with the browser version. This is the same React app that will run in the Tauri desktop shell."

**Actions**:
1. **Start dev server**
   ```bash
   npm run dev
   ```

2. **Open browser** to http://localhost:1420

3. **Point out UI elements**:
   - "Notice the connection indicator - green means connected to backend"
   - "These language badges will show detected languages"
   - "The transcript panel displays the conversation"
   - "Audio status shows streaming levels"

4. **Click "Start Call"**

5. **Observe real-time updates**:
   - "Watch the call state transition: connecting → active"
   - "Language detection: Spanish for caller, English for telecommunicator"
   - "Transcript appears in real-time with interim (gray) and final (solid) states"
   - "Audio levels update every 500ms"
   - "Timer counts up during the call"

6. **Wait for conversation to finish** (~15 seconds) or click "End Call"

**Key Message**: 
> "Everything you see is driven by WebSocket messages from the backend. The frontend is purely presentational."

---

### Part 2: Desktop Mode (2 minutes)

**Talking Points**:
> "Now let's run the exact same app in Tauri desktop mode. No code changes needed."

**Actions**:
1. **Stop browser dev server** (Ctrl+C)

2. **Start Tauri**
   ```bash
   npm run tauri:dev
   ```
   _(Note: First run may take 2-3 minutes to compile Rust)_

3. **Window opens** - Looks identical to browser version

4. **Click "Start Call"** again

5. **Show it works identically**

**Key Message**:
> "Same React code, same backend connection. Tauri is just a desktop shell around our web app."

---

### Part 3: Interface Contract (3 minutes)

**Talking Points**:
> "The secret to this separation is our interface contract. Let me show you."

**Actions**:
1. **Open `src/types/messages.ts` in editor**

2. **Scroll through types**:
   - "Frontend sends these messages: call:start, call:end, ui:interaction"
   - "Backend sends these: connection:ack, call:state, language:detected, etc."
   - "All typed in TypeScript for safety"

3. **Open `backend/src/types.ts`**:
   - "Backend has identical types"
   - "This contract is the ONLY thing frontend and backend agree on"

4. **Open backend logs**:
   ```bash
   tail -f backend/logs/interactions.jsonl
   ```
   - "Every UI interaction is logged here"
   - "Each line is JSON - easy to analyze"

**Key Message**:
> "As long as we maintain this interface, frontend and backend can evolve independently."

---

### Part 4: Component Swappability (4 minutes)

**Talking Points**:
> "Now, the UX team's main concern: can we replace AI-generated components? Yes."

**Actions**:
1. **Open `src/components/stitch/LanguageBadge.tsx`**

2. **Point out interface**:
   ```typescript
   interface LanguageBadgeProps {
     speaker: 'caller' | 'telecommunicator';
     languageCode: string;
     languageName: string;
     confidence: number;
     status: 'detecting' | 'confirmed' | 'none';
   }
   ```
   - "This component receives these props from the parent"
   - "It can be completely rewritten as long as props stay the same"

3. **Make a visible change** (with hot reload running):
   - Change background color: `bg-accent` → `bg-purple-500`
   - Or change text: `"Caller"` → `"🇪🇸 Caller"`
   - Save file
   - **Show instant update in UI**

4. **Revert change** (or keep for effect)

5. **Open `docs/component-replacement-guide.md`**:
   - "Full guide for UX team on how to swap components"
   - "Includes interface specs for all 5 swappable components"

**Key Message**:
> "UX team can replace any component in the 'stitch' folder without touching backend or state management."

---

### Part 5: Interaction Logging (2 minutes)

**Talking Points**:
> "Finally, let's verify that all interactions are logged."

**Actions**:
1. **Clear logs** (optional):
   ```bash
   > backend/logs/interactions.jsonl
   ```

2. **In running app, click around**:
   - Click "Start Call"
   - Wait a moment
   - Click "End Call"

3. **Show logs**:
   ```bash
   cat backend/logs/interactions.jsonl | jq .
   ```
   - "Each interaction is timestamped"
   - "Component name and action recorded"
   - "Session ID for tracking"

4. **Explain use case**:
   - "Product team can analyze user behavior"
   - "UX can validate designs with real interaction data"
   - "QA can verify all features were tested"

**Key Message**:
> "Complete observability of UI interactions without instrumenting the frontend."

---

## 🎨 Optional: Figma Workflow Demo (3 minutes)

**If audience includes Figma Workflow Team**:

**Talking Points**:
> "This POC is also a testbed for Figma-to-code tools."

**Actions**:
1. **Open `docs/figma-to-code-strategy-guide.md`**

2. **Explain evaluation criteria**:
   - "We're comparing Builder.io, Anima, Locofy, and others"
   - "Each tool exports Figma designs to React + Tailwind"
   - "This POC lets us test them with real components"

3. **Show test scenario**:
   - "Design a component in Figma"
   - "Export with tool"
   - "Replace a file in src/components/stitch/"
   - "Test immediately with live backend"

4. **Metrics**:
   - "We're tracking: time to first render, code quality, fidelity"

**Key Message**:
> "POC provides a realistic testbed for evaluating Figma-to-code workflows."

---

## ❓ Q&A Preparation

### Common Questions

**Q: What if the interface contract needs to change?**  
A: Both frontend and backend would need updates, but they can be versioned. We could support multiple contract versions simultaneously.

**Q: Can we use this with the real backend?**  
A: Yes! Just point WebSocket URL to real backend. As long as it implements the same message types, it will work.

**Q: What about authentication/security?**  
A: Not in this POC. Real implementation would add auth tokens in WebSocket handshake.

**Q: Can we use Vue/Angular instead of React?**  
A: Yes, but you'd reimplement the frontend. Backend is framework-agnostic.

**Q: How do we deploy this?**  
A: Frontend: static hosting (Netlify, Vercel) or Tauri packaged app. Backend: Docker container on any cloud.

**Q: What's the performance like?**  
A: Excellent. WebSocket is very efficient. We see <50ms latency in testing.

---

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check if port 8080 is in use
lsof -i :8080

# Kill process using port
kill -9 [PID]

# Restart backend
cd backend && npm run dev
```

### Frontend won't connect

1. Verify backend is running: Check for "WebSocket server started" message
2. Check console for errors: F12 in browser
3. Verify WebSocket URL: Should be `ws://localhost:8080` in `src/hooks/useWebSocket.ts`

### Tauri won't compile

```bash
# Ensure Rust is installed
rustc --version

# If not, install
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Update Rust
rustup update

# Retry
npm run tauri:dev
```

### Hot reload not working

1. Restart dev server
2. Clear browser cache (Ctrl+Shift+R)
3. Check file is saved
4. Verify Vite is watching files (should see message in terminal)

---

## 📊 Demo Checklist

**Before Demo**:
- [ ] Repository cloned and dependencies installed
- [ ] Backend running (`ws://localhost:8080` accessible)
- [ ] Frontend dev server tested (`npm run dev` works)
- [ ] Tauri tested if showing desktop mode (`npm run tauri:dev` works)
- [ ] Code editor open with key files
- [ ] Logs tail ready (`tail -f backend/logs/interactions.jsonl`)
- [ ] Browser window positioned for visibility
- [ ] Screen recording started (if recording)

**During Demo**:
- [ ] Introduced POC goals
- [ ] Showed browser mode
- [ ] Demonstrated call flow
- [ ] Showed desktop mode (if applicable)
- [ ] Explained interface contract
- [ ] Demonstrated component swappability
- [ ] Showed interaction logs
- [ ] Answered questions

**After Demo**:
- [ ] Collected feedback
- [ ] Noted questions for documentation
- [ ] Shared repository link
- [ ] Shared documentation links

---

## 📚 Resources to Share

After demo, share:
- **Repository**: [Link to repo]
- **Component Replacement Guide**: `docs/component-replacement-guide.md`
- **Figma-to-Code Guide**: `docs/figma-to-code-strategy-guide.md`
- **README**: Quick start instructions

---

**Last Updated**: 2024-02-04  
**Demo Owner**: Versaterm Design Systems Team
