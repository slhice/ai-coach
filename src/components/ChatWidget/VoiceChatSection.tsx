import React from 'react';

interface VoiceChatSectionProps {
  embedCode?: string;
}

export const VoiceChatSection: React.FC<VoiceChatSectionProps> = ({ embedCode }) => {
  if (!embedCode) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Voice chat is not configured</p>
      </div>
    );
  }

  // Create a container that fills the available space
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative">
        <iframe
          id="audio_iframe"
          src={embedCode}
          allow="microphone"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            background: 'transparent'
          }}
        />
      </div>
    </div>
  );
};