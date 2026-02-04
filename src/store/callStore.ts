import { create } from 'zustand';
import type {
  CallStateData,
  LanguageDetection,
  TranscriptSegment,
  AudioStatus,
} from '../types/messages';

interface CallStore {
  // Connection state
  connected: boolean;
  sessionId: string | null;
  setConnected: (connected: boolean) => void;
  setSessionId: (sessionId: string) => void;

  // Call state
  callState: CallStateData['state'];
  callStartTime: number | null;
  setCallState: (state: CallStateData['state'], timestamp: number) => void;

  // Language detection
  callerLanguage: LanguageDetection | null;
  telecommunicatorLanguage: LanguageDetection | null;
  setLanguageDetection: (detection: LanguageDetection) => void;

  // Transcript
  transcripts: TranscriptSegment[];
  addTranscript: (segment: TranscriptSegment) => void;
  clearTranscripts: () => void;

  // Audio status
  audioStatus: AudioStatus | null;
  setAudioStatus: (status: AudioStatus) => void;

  // Toast notifications
  toast: { message: string; type: 'info' | 'success' | 'warning' | 'error' } | null;
  showToast: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  hideToast: () => void;
}

export const useCallStore = create<CallStore>((set) => ({
  // Connection state
  connected: false,
  sessionId: null,
  setConnected: (connected) => set({ connected }),
  setSessionId: (sessionId) => set({ sessionId }),

  // Call state
  callState: 'idle',
  callStartTime: null,
  setCallState: (state, timestamp) => {
    const updates: Partial<CallStore> = { callState: state };
    if (state === 'active') {
      updates.callStartTime = timestamp;
    } else if (state === 'idle' || state === 'ended') {
      updates.callStartTime = null;
    }
    set(updates);
  },

  // Language detection
  callerLanguage: null,
  telecommunicatorLanguage: null,
  setLanguageDetection: (detection) => {
    if (detection.speaker === 'caller') {
      set({ callerLanguage: detection });
    } else {
      set({ telecommunicatorLanguage: detection });
    }
  },

  // Transcript
  transcripts: [],
  addTranscript: (segment) =>
    set((state) => {
      // Replace interim transcripts, append final ones
      if (!segment.isFinal) {
        const filtered = state.transcripts.filter(
          (t) => t.speaker !== segment.speaker || t.isFinal
        );
        return { transcripts: [...filtered, segment] };
      }
      return { transcripts: [...state.transcripts, segment] };
    }),
  clearTranscripts: () => set({ transcripts: [] }),

  // Audio status
  audioStatus: null,
  setAudioStatus: (audioStatus) => set({ audioStatus }),

  // Toast notifications
  toast: null,
  showToast: (message, type) => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null }),
}));
