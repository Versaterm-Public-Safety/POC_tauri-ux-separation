import { useCallback } from 'react';
import type { ClientMessage } from '../types/messages';

interface UseInteractionTrackerProps {
  sendMessage: (message: ClientMessage) => void;
}

export function useInteractionTracker({ sendMessage }: UseInteractionTrackerProps) {
  const trackInteraction = useCallback(
    (component: string, action: string, metadata?: Record<string, unknown>) => {
      sendMessage({
        type: 'ui:interaction',
        data: {
          component,
          action,
          timestamp: Date.now(),
          metadata,
        },
      });
    },
    [sendMessage]
  );

  return { trackInteraction };
}
