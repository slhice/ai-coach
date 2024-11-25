import React from 'react';
import { Mic } from 'lucide-react';

interface VirtualChatPanelProps {
  synthflowWidgetId: string;
}

export const VirtualChatPanel: React.FC<VirtualChatPanelProps> = ({ synthflowWidgetId }) => {
  // Extract the widget URL from the embed code
  const extractSynthflowUrl = (embedCode: string) => {
    try {
      const match = embedCode.match(/src="([^"]+)"/);
      return match ? match[1] : '';
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 h-[600px] flex flex-col">
      <div className="flex items-center space-x-2 mb-4">
        <Mic className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-800">Voice Chat</h2>
      </div>
      <div className="flex-1 relative">
        <iframe 
          id="audio_iframe" 
          src={extractSynthflowUrl(synthflowWidgetId)}
          allow="microphone"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'transparent',
            border: 'none',
            borderRadius: '0.5rem'
          }}
        />
      </div>
    </div>
  );
};