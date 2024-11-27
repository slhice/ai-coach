import React from 'react';
import { X } from 'lucide-react';

interface VoiceChatPanelProps {
  onClose: () => void;
}

export const VoiceChatPanel: React.FC<VoiceChatPanelProps> = ({ onClose }) => {
  return (
    <div className="w-[400px] bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-semibold">Voice Chat</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 relative">
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
    </div>
  );
};