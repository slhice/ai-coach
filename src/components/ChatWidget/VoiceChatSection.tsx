import React from 'react';

export const VoiceChatSection: React.FC = () => {
  return (
    <div className="h-full relative">
      <iframe
        id="audio_iframe"
        src="https://widget.synthflow.ai/widget/v2/1732412363329x361703737348048260/1732412363252x359106795403778300"
        allow="microphone"
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          border: 'none',
          background: 'transparent'
        }}
      />
    </div>
  );
};