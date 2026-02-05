import { useEffect, useRef, useState } from 'react';
import type { TranscriptSegment } from '../../types/messages';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { useExternalResizeObserver } from '../../hooks/useResizeObserver';
import { NewContentBadge } from './NewContentBadge';

/** Minimum height fallback when audio status ref unavailable (FR-009) */
const MIN_HEIGHT = 200;
/** Height ratio relative to audio status window (FR-001) */
const HEIGHT_RATIO = 2;

interface TranscriptPanelProps {
  messages: TranscriptSegment[];
  /** Reference to audio status window for height calculation (FR-001) */
  audioStatusRef?: React.RefObject<HTMLElement>;
  /** Optional callback when scroll state changes */
  onScrollStateChange?: (isLive: boolean) => void;
}

export function TranscriptPanel({ 
  messages, 
  audioStatusRef,
  onScrollStateChange 
}: TranscriptPanelProps) {
  const { containerRef, isLive, scrollToBottom } = useAutoScroll();
  const audioStatusSize = useExternalResizeObserver(audioStatusRef);
  
  // Track new entries when in review mode (US2: FR-005)
  const [newEntryCount, setNewEntryCount] = useState(0);
  const prevMessagesCountRef = useRef(messages.length);

  // Calculate height based on audio status window (US3: FR-001, FR-007)
  const calculatedHeight = audioStatusSize.height > 0 
    ? Math.max(audioStatusSize.height * HEIGHT_RATIO, MIN_HEIGHT)
    : MIN_HEIGHT;

  // Notify parent of scroll state changes
  useEffect(() => {
    onScrollStateChange?.(isLive);
  }, [isLive, onScrollStateChange]);

  // Track new entries when not in live mode (FR-005)
  useEffect(() => {
    const newCount = messages.length - prevMessagesCountRef.current;
    
    if (newCount > 0) {
      if (!isLive) {
        setNewEntryCount(prev => prev + newCount);
      } else {
        // Auto-scroll to new entries (FR-003)
        scrollToBottom();
      }
    }
    
    prevMessagesCountRef.current = messages.length;
  }, [messages.length, isLive, scrollToBottom]);

  // Reset new entry count when returning to live mode (FR-006)
  useEffect(() => {
    if (isLive) {
      setNewEntryCount(0);
    }
  }, [isLive]);

  // Handle badge click (FR-005, FR-006)
  const handleBadgeClick = () => {
    scrollToBottom();
    setNewEntryCount(0);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div 
      className="flex flex-col bg-gray-50 rounded-lg border border-gray-200 relative"
      style={{ height: calculatedHeight, minHeight: MIN_HEIGHT }}
    >
      <div className="px-4 py-3 border-b border-gray-200 bg-white rounded-t-lg">
        <h2 className="text-lg font-semibold text-gray-900">Transcript</h2>
        <p className="text-sm text-gray-500">Real-time conversation</p>
      </div>
      
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>No transcript yet. Start a call to see the conversation.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.speaker === 'caller' ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 break-words ${
                  msg.speaker === 'caller'
                    ? 'bg-white border border-gray-300 text-gray-900'
                    : 'bg-primary text-white'
                } ${!msg.isFinal ? 'opacity-60 italic' : ''}`}
              >
                <div className="text-xs font-medium mb-1 opacity-75">
                  {msg.speaker === 'caller' ? 'Caller' : 'Telecommunicator'}
                </div>
                <div className="text-sm leading-relaxed">{msg.text}</div>
                <div className="text-xs mt-1 opacity-60">
                  {formatTime(msg.timestamp)}
                  {!msg.isFinal && ' (interim)'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Floating badge for new entries (FR-005) */}
      <NewContentBadge
        count={newEntryCount}
        onClick={handleBadgeClick}
        visible={!isLive && newEntryCount > 0}
      />
    </div>
  );
}
