import React, { useEffect, useRef } from 'react';
import type { TranscriptSegment } from '../../types/messages';

interface TranscriptPanelProps {
  messages: TranscriptSegment[];
}

export function TranscriptPanel({ messages }: TranscriptPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200 bg-white rounded-t-lg">
        <h2 className="text-lg font-semibold text-gray-900">Transcript</h2>
        <p className="text-sm text-gray-500">Real-time conversation</p>
      </div>
      
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
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
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
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
    </div>
  );
}
