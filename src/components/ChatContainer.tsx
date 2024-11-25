import React, { useState } from 'react';
import { GraduationCap, Send } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { VoiceWidget } from './VoiceWidget';
import { Message } from '../types';

interface ChatContainerProps {
  messages: Message[];
  showNotes: boolean;
  isProcessing: boolean;
  onSpeechResult: (transcript: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  showNotes,
  isProcessing,
  onSpeechResult,
  messagesEndRef,
}) => {
  const [inputText, setInputText] = useState('');
  const deploymentDate = new Date().toLocaleString();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSpeechResult(inputText);
      setInputText('');
    }
  };

  return (
    <div className={`bg-gray-50 rounded-2xl shadow-lg p-4 min-h-[600px] flex flex-col ${showNotes ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.text}
            isAI={message.isAI}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t pt-4">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm">
            <GraduationCap className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask your coach anything..."
              className="flex-1 outline-none text-sm text-gray-700"
              disabled={isProcessing}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isProcessing}
              className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
            >
              <Send className="w-5 h-5 text-blue-600" />
            </button>
          </div>
        </form>
        <div className="mt-4 text-center text-xs text-gray-400">
          Last deployed: {deploymentDate}
        </div>
      </div>
    </div>
  );
};