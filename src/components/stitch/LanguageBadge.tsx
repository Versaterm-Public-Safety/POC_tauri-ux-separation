import React from 'react';

interface LanguageBadgeProps {
  speaker: 'caller' | 'telecommunicator';
  languageCode: string;
  languageName: string;
  confidence: number;
  status: 'detecting' | 'confirmed' | 'none';
}

export function LanguageBadge({
  speaker,
  languageCode,
  languageName,
  confidence,
  status,
}: LanguageBadgeProps) {
  const speakerLabel = speaker === 'caller' ? 'Caller' : 'Telecommunicator';
  
  const getStatusColor = () => {
    if (status === 'none') return 'bg-gray-200 text-gray-600';
    if (status === 'detecting') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (confidence > 0.8) return 'bg-accent text-white border-accent';
    if (confidence > 0.5) return 'bg-blue-100 text-blue-800 border-blue-300';
    return 'bg-orange-100 text-orange-800 border-orange-300';
  };

  if (status === 'none') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${getStatusColor()}`}>
        <span className="text-xs">{speakerLabel}</span>
        <span>No language detected</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 text-sm font-medium ${getStatusColor()}`}>
      <span className="text-xs uppercase tracking-wide">{speakerLabel}</span>
      <span className="font-bold">{languageCode.toUpperCase()}</span>
      <span>{languageName}</span>
      <span className="text-xs opacity-80">({Math.round(confidence * 100)}%)</span>
      {status === 'detecting' && (
        <span className="inline-block w-2 h-2 bg-current rounded-full animate-pulse"></span>
      )}
    </div>
  );
}
