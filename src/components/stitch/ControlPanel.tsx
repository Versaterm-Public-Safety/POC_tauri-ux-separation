import { useEffect, useState } from 'react';

interface ControlPanelProps {
  callState: 'idle' | 'connecting' | 'active' | 'ended';
  callStartTime: number | null;
  onStartCall: () => void;
  onEndCall: () => void;
}

export function ControlPanel({
  callState,
  callStartTime,
  onStartCall,
  onEndCall,
}: ControlPanelProps) {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let interval: number | undefined;

    if (callState === 'active' && callStartTime) {
      interval = window.setInterval(() => {
        setDuration(Math.floor((Date.now() - callStartTime) / 1000));
      }, 1000);
    } else {
      setDuration(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callState, callStartTime]);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStateIndicator = () => {
    switch (callState) {
      case 'idle':
        return { label: 'Ready', color: 'bg-gray-400' };
      case 'connecting':
        return { label: 'Connecting...', color: 'bg-yellow-500 animate-pulse' };
      case 'active':
        return { label: 'In Call', color: 'bg-accent animate-pulse' };
      case 'ended':
        return { label: 'Call Ended', color: 'bg-gray-400' };
    }
  };

  const indicator = getStateIndicator();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${indicator.color}`}></div>
          <span className="text-sm font-medium text-gray-700">{indicator.label}</span>
        </div>
        {callState === 'active' && (
          <div className="text-2xl font-mono font-bold text-gray-900">
            {formatDuration(duration)}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {(callState === 'idle' || callState === 'ended') && (
          <button
            onClick={onStartCall}
            className="flex-1 bg-accent hover:bg-accent/90 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg shadow-md hover:shadow-lg"
          >
            Start Call
          </button>
        )}
        
        {(callState === 'active' || callState === 'connecting') && (
          <button
            onClick={onEndCall}
            className="flex-1 bg-error hover:bg-error/90 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg shadow-md hover:shadow-lg"
          >
            End Call
          </button>
        )}
      </div>
    </div>
  );
}
