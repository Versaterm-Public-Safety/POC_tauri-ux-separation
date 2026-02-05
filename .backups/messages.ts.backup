// Interface Contract Types for WebSocket Communication

// Message Types - Frontend to Backend
export type ClientMessage =
  | { type: 'call:start' }
  | { type: 'call:end' }
  | { type: 'ui:interaction'; data: UIInteraction };

export interface UIInteraction {
  component: string;
  action: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

// Message Types - Backend to Frontend
export type ServerMessage =
  | { type: 'connection:ack'; data: { sessionId: string } }
  | { type: 'call:state'; data: CallStateData }
  | { type: 'language:detected'; data: LanguageDetection }
  | { type: 'transcript:segment'; data: TranscriptSegment }
  | { type: 'audio:status'; data: AudioStatus }
  | { type: 'ui:interaction:ack'; data: { interactionId: string } };

export interface CallStateData {
  state: 'idle' | 'connecting' | 'active' | 'ended';
  timestamp: number;
}

export interface LanguageDetection {
  speaker: 'caller' | 'telecommunicator';
  languageCode: string;
  languageName: string;
  confidence: number;
}

export interface TranscriptSegment {
  speaker: 'caller' | 'telecommunicator';
  text: string;
  timestamp: number;
  isFinal: boolean;
}

export interface AudioStatus {
  caller: ChannelStatus;
  telecommunicator: ChannelStatus;
}

export interface ChannelStatus {
  status: 'streaming' | 'muted' | 'disconnected';
  level?: number; // 0-100
}
