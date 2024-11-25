import React from 'react';

interface VoiceWidgetProps {
  onSpeechResult: (transcript: string) => void;
  isProcessing: boolean;
}

export const VoiceWidget: React.FC<VoiceWidgetProps> = () => {
  return null; // We no longer need this component as the widget is moved to VirtualChatPanel
};