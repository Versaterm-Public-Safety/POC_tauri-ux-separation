// Shared types matching frontend interface contract

// Base message structure - all messages extend this
export interface BaseMessage {
  type: string;
  messageId: string; // UUID v4
  timestamp: string; // ISO 8601
}

export type ClientMessage =
  | (BaseMessage & { type: 'call:start' })
  | (BaseMessage & { type: 'call:end' })
  | (BaseMessage & { type: 'ui:interaction'; payload: UIInteraction });

export interface UIInteraction {
  component: string;
  action: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export type ServerMessage =
  | (BaseMessage & { type: 'connection:ack'; payload: { sessionId: string } })
  | (BaseMessage & { type: 'call:state'; payload: CallStateData })
  | (BaseMessage & { type: 'language:detected'; payload: LanguageDetection })
  | (BaseMessage & { type: 'transcript:segment'; payload: TranscriptSegment })
  | (BaseMessage & { type: 'audio:status'; payload: AudioStatus })
  | (BaseMessage & { type: 'ui:interaction:ack'; payload: { interactionId: string } });

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
  segmentId: string;      // UUID v4 - unique identifier for this segment
  speaker: 'caller' | 'telecommunicator';
  text: string;
  timestamp: number;
  startTime: number;      // Call-relative time in seconds when segment started
  endTime?: number;       // Call-relative time in seconds when segment ended (only set when isFinal=true)
  isFinal: boolean;
}

export interface AudioStatus {
  caller: ChannelStatus;
  telecommunicator: ChannelStatus;
}

export interface ChannelStatus {
  status: 'streaming' | 'muted' | 'disconnected';
  level?: number;
}
