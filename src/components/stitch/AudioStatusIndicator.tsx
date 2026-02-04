import type { ChannelStatus } from '../../types/messages';

interface AudioStatusIndicatorProps {
  callerStatus: ChannelStatus;
  telecommunicatorStatus: ChannelStatus;
}

export function AudioStatusIndicator({
  callerStatus,
  telecommunicatorStatus,
}: AudioStatusIndicatorProps) {
  const renderChannel = (label: string, status: ChannelStatus) => {
    const getStatusColor = () => {
      switch (status.status) {
        case 'streaming':
          return 'text-accent';
        case 'muted':
          return 'text-yellow-500';
        case 'disconnected':
          return 'text-gray-400';
      }
    };

    const getStatusIcon = () => {
      switch (status.status) {
        case 'streaming':
          return (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm-4 4a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1zm8 0a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1zm-4-2a1 1 0 011 1v8a1 1 0 11-2 0V6a1 1 0 011-1z" />
            </svg>
          );
        case 'muted':
          return (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v9a1 1 0 11-2 0V3a1 1 0 011-1zm-5 8a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm10 0a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1z" clipRule="evenodd" />
              <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
            </svg>
          );
        case 'disconnected':
          return (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm2 2v8h10V5H5z" clipRule="evenodd" />
              <line x1="3" y1="3" x2="17" y2="17" stroke="currentColor" strokeWidth="2" />
            </svg>
          );
      }
    };

    return (
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <div className={getStatusColor()}>
          {getStatusIcon()}
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900">{label}</div>
          <div className={`text-xs capitalize ${getStatusColor()}`}>
            {status.status}
          </div>
        </div>
        {status.status === 'streaming' && status.level !== undefined && (
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-1 h-3 rounded ${
                  i < Math.floor(status.level! / 20)
                    ? 'bg-accent'
                    : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Audio Status</h3>
      <div className="space-y-2">
        {renderChannel('Caller', callerStatus)}
        {renderChannel('Telecommunicator', telecommunicatorStatus)}
      </div>
    </div>
  );
}
