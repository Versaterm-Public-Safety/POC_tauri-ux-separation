import { useEffect, useRef } from 'react';
import { useCallStore } from '../store/callStore';
import type { ServerMessage, ClientMessage } from '../types/messages';

const WS_URL = 'ws://localhost:8080';
const RECONNECT_INTERVAL = 3000;

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  
  const {
    setConnected,
    setSessionId,
    setCallState,
    setLanguageDetection,
    addTranscript,
    setAudioStatus,
    showToast,
  } = useCallStore();

  const connect = () => {
    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setConnected(true);
        showToast('Connected to backend', 'success');
      };

      ws.onmessage = (event) => {
        try {
          const message: ServerMessage = JSON.parse(event.data);
          console.log('Received:', message);

          switch (message.type) {
            case 'connection:ack':
              setSessionId(message.data.sessionId);
              break;
            case 'call:state':
              setCallState(message.data.state, message.data.timestamp);
              break;
            case 'language:detected':
              setLanguageDetection(message.data);
              break;
            case 'transcript:segment':
              addTranscript(message.data);
              break;
            case 'audio:status':
              setAudioStatus(message.data);
              break;
            case 'ui:interaction:ack':
              // Interaction acknowledged
              break;
          }
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        showToast('Connection error', 'error');
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setConnected(false);
        wsRef.current = null;
        
        // Attempt to reconnect
        reconnectTimeoutRef.current = window.setTimeout(() => {
          console.log('Attempting to reconnect...');
          connect();
        }, RECONNECT_INTERVAL);
      };
    } catch (error) {
      console.error('Failed to connect:', error);
      showToast('Failed to connect', 'error');
    }
  };

  const sendMessage = (message: ClientMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      console.log('Sent:', message);
    } else {
      console.warn('WebSocket not connected, message not sent:', message);
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return { sendMessage };
}
