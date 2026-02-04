import { WebSocketServer, WebSocket } from 'ws';
import { randomUUID } from 'crypto';
import type { ClientMessage, ServerMessage, AudioStatus } from './types.js';
import { logInteraction, logEvent } from './logger.js';
import { mockConversation } from './mockConversation.js';

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

interface ClientSession {
  ws: WebSocket;
  sessionId: string;
  callActive: boolean;
  conversationTimeouts: NodeJS.Timeout[];
}

const sessions = new Map<WebSocket, ClientSession>();

console.log(`WebSocket server started on port ${PORT}`);
console.log('Waiting for connections...\n');

wss.on('connection', (ws: WebSocket) => {
  const sessionId = randomUUID();
  const session: ClientSession = {
    ws,
    sessionId,
    callActive: false,
    conversationTimeouts: [],
  };
  
  sessions.set(ws, session);
  
  console.log(`[${sessionId}] Client connected`);
  logEvent(sessionId, 'connection', { timestamp: Date.now() });

  // Send connection acknowledgment
  const ackMessage: ServerMessage = {
    type: 'connection:ack',
    data: { sessionId },
  };
  ws.send(JSON.stringify(ackMessage));

  // Send initial idle state
  const idleState: ServerMessage = {
    type: 'call:state',
    data: { state: 'idle', timestamp: Date.now() },
  };
  ws.send(JSON.stringify(idleState));

  ws.on('message', (data: Buffer) => {
    try {
      const message: ClientMessage = JSON.parse(data.toString());
      console.log(`[${sessionId}] Received:`, message);

      switch (message.type) {
        case 'call:start':
          handleCallStart(session);
          break;
        
        case 'call:end':
          handleCallEnd(session);
          break;
        
        case 'ui:interaction':
          logInteraction(sessionId, message.data);
          // Acknowledge interaction
          const ack: ServerMessage = {
            type: 'ui:interaction:ack',
            data: { interactionId: randomUUID() },
          };
          ws.send(JSON.stringify(ack));
          break;
      }
    } catch (error) {
      console.error(`[${sessionId}] Error parsing message:`, error);
    }
  });

  ws.on('close', () => {
    console.log(`[${sessionId}] Client disconnected`);
    logEvent(sessionId, 'disconnection', { timestamp: Date.now() });
    
    // Clean up any active timeouts
    const session = sessions.get(ws);
    if (session) {
      session.conversationTimeouts.forEach(timeout => clearTimeout(timeout));
    }
    
    sessions.delete(ws);
  });

  ws.on('error', (error) => {
    console.error(`[${sessionId}] WebSocket error:`, error);
  });
});

function handleCallStart(session: ClientSession): void {
  const { ws, sessionId } = session;
  
  if (session.callActive) {
    console.log(`[${sessionId}] Call already active`);
    return;
  }

  session.callActive = true;
  logEvent(sessionId, 'call:start', { timestamp: Date.now() });

  // Send connecting state
  const connectingMsg: ServerMessage = {
    type: 'call:state',
    data: { state: 'connecting', timestamp: Date.now() },
  };
  ws.send(JSON.stringify(connectingMsg));

  // After 1 second, transition to active
  setTimeout(() => {
    const activeMsg: ServerMessage = {
      type: 'call:state',
      data: { state: 'active', timestamp: Date.now() },
    };
    ws.send(JSON.stringify(activeMsg));

    // Detect caller language (Spanish)
    setTimeout(() => {
      const callerLangMsg: ServerMessage = {
        type: 'language:detected',
        data: {
          speaker: 'caller',
          languageCode: 'es',
          languageName: 'Spanish',
          confidence: 0.92,
        },
      };
      ws.send(JSON.stringify(callerLangMsg));
    }, 1500);

    // Detect telecommunicator language (English)
    setTimeout(() => {
      const telecomLangMsg: ServerMessage = {
        type: 'language:detected',
        data: {
          speaker: 'telecommunicator',
          languageCode: 'en',
          languageName: 'English',
          confidence: 0.98,
        },
      };
      ws.send(JSON.stringify(telecomLangMsg));
    }, 2000);

    // Send initial audio status
    const audioMsg: ServerMessage = {
      type: 'audio:status',
      data: {
        caller: { status: 'streaming', level: 75 },
        telecommunicator: { status: 'streaming', level: 80 },
      },
    };
    ws.send(JSON.stringify(audioMsg));

    // Start mock conversation
    playMockConversation(session);
    
    // Update audio levels periodically
    startAudioLevelUpdates(session);
  }, 1000);
}

function handleCallEnd(session: ClientSession): void {
  const { ws, sessionId } = session;
  
  if (!session.callActive) {
    console.log(`[${sessionId}] No active call to end`);
    return;
  }

  session.callActive = false;
  logEvent(sessionId, 'call:end', { timestamp: Date.now() });

  // Clear all conversation timeouts
  session.conversationTimeouts.forEach(timeout => clearTimeout(timeout));
  session.conversationTimeouts = [];

  // Send ended state
  const endedMsg: ServerMessage = {
    type: 'call:state',
    data: { state: 'ended', timestamp: Date.now() },
  };
  ws.send(JSON.stringify(endedMsg));

  // After 2 seconds, return to idle
  setTimeout(() => {
    const idleMsg: ServerMessage = {
      type: 'call:state',
      data: { state: 'idle', timestamp: Date.now() },
    };
    ws.send(JSON.stringify(idleMsg));
  }, 2000);
}

function playMockConversation(session: ClientSession): void {
  const { ws } = session;
  const callStartTime = Date.now();

  mockConversation.forEach(({ delay, segment }) => {
    const timeout = setTimeout(() => {
      if (!session.callActive) return;

      const transcriptMsg: ServerMessage = {
        type: 'transcript:segment',
        data: {
          ...segment,
          timestamp: callStartTime + delay,
        },
      };
      ws.send(JSON.stringify(transcriptMsg));
    }, delay);

    session.conversationTimeouts.push(timeout);
  });
}

function startAudioLevelUpdates(session: ClientSession): void {
  const { ws } = session;
  
  const updateInterval = setInterval(() => {
    if (!session.callActive) {
      clearInterval(updateInterval);
      return;
    }

    // Random audio levels to simulate real audio
    const audioMsg: ServerMessage = {
      type: 'audio:status',
      data: {
        caller: {
          status: 'streaming',
          level: Math.floor(Math.random() * 30) + 60, // 60-90
        },
        telecommunicator: {
          status: 'streaming',
          level: Math.floor(Math.random() * 30) + 60, // 60-90
        },
      },
    };
    ws.send(JSON.stringify(audioMsg));
  }, 500);

  // Store interval ID in timeouts array for cleanup
  session.conversationTimeouts.push(updateInterval as unknown as NodeJS.Timeout);
}
