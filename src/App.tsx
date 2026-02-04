import React from 'react';
import { AppShell } from './components/layout/AppShell';
import { LanguageBadge } from './components/stitch/LanguageBadge';
import { TranscriptPanel } from './components/stitch/TranscriptPanel';
import { ControlPanel } from './components/stitch/ControlPanel';
import { AudioStatusIndicator } from './components/stitch/AudioStatusIndicator';
import { NotificationToast } from './components/stitch/NotificationToast';
import { useWebSocket } from './hooks/useWebSocket';
import { useInteractionTracker } from './hooks/useInteractionTracker';
import { useCallStore } from './store/callStore';
import './App.css';

function App() {
  const { sendMessage } = useWebSocket();
  const { trackInteraction } = useInteractionTracker({ sendMessage });

  const {
    callState,
    callStartTime,
    callerLanguage,
    telecommunicatorLanguage,
    transcripts,
    audioStatus,
    toast,
    hideToast,
  } = useCallStore();

  const handleStartCall = () => {
    trackInteraction('ControlPanel', 'start_call');
    sendMessage({ type: 'call:start' });
  };

  const handleEndCall = () => {
    trackInteraction('ControlPanel', 'end_call');
    sendMessage({ type: 'call:end' });
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Language Detection Row */}
        <div className="flex gap-4 flex-wrap">
          {callerLanguage ? (
            <LanguageBadge
              speaker="caller"
              languageCode={callerLanguage.languageCode}
              languageName={callerLanguage.languageName}
              confidence={callerLanguage.confidence}
              status={callState === 'active' ? 'confirmed' : 'none'}
            />
          ) : (
            <LanguageBadge
              speaker="caller"
              languageCode=""
              languageName=""
              confidence={0}
              status="none"
            />
          )}
          
          {telecommunicatorLanguage ? (
            <LanguageBadge
              speaker="telecommunicator"
              languageCode={telecommunicatorLanguage.languageCode}
              languageName={telecommunicatorLanguage.languageName}
              confidence={telecommunicatorLanguage.confidence}
              status={callState === 'active' ? 'confirmed' : 'none'}
            />
          ) : (
            <LanguageBadge
              speaker="telecommunicator"
              languageCode=""
              languageName=""
              confidence={0}
              status="none"
            />
          )}
        </div>

        {/* Control Panel */}
        <ControlPanel
          callState={callState}
          callStartTime={callStartTime}
          onStartCall={handleStartCall}
          onEndCall={handleEndCall}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transcript Panel - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <TranscriptPanel messages={transcripts} />
          </div>

          {/* Audio Status - Takes 1 column */}
          <div>
            {audioStatus && (
              <AudioStatusIndicator
                callerStatus={audioStatus.caller}
                telecommunicatorStatus={audioStatus.telecommunicator}
              />
            )}
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <NotificationToast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </AppShell>
  );
}

export default App;
