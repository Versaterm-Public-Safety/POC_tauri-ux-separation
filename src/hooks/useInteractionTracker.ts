import { useCallback } from 'react';
import type { ClientMessage } from '../types/messages';

interface UseInteractionTrackerProps {
  sendMessage: (message: Omit<ClientMessage, 'messageId' | 'timestamp'>) => void;
}

export function useInteractionTracker({ sendMessage }: UseInteractionTrackerProps) {
  const trackInteraction = useCallback(
    (component: string, action: string, metadata?: Record<string, unknown>) => {
      sendMessage({
        type: 'ui:interaction',
        payload: {
          component,
          action,
          timestamp: Date.now(),
          metadata,
        },
      } as any); // Type assertion needed due to Omit complexity
    },
    [sendMessage]
  );

  return { trackInteraction };
}
