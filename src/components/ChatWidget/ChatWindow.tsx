import React, { useState, useEffect } from 'react';
import { X, Pencil, Mic, MessageCircle } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { NotesSection } from './NotesSection';
import { VoiceChatSection } from './VoiceChatSection';
import { Message } from '../../types/chat';
import { AdminSettings } from '../../types/admin';

interface ChatWindowProps {
  messages: Message[];
  onClose: () => void;
  onSendMessage: (message: string) => void;
  settings: AdminSettings;
  isProcessing?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onClose,
  onSendMessage,
  settings,
  isProcessing = false,
}) => {
  const [activeSection, setActiveSection] = useState<'chat' | 'notes' | 'voice'>('chat');
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (
      (activeSection === 'notes' && !settings.chatbotSettings.enableNotes) ||
      (activeSection === 'voice' && !settings.chatbotSettings.enableVoiceChat)
    ) {
      setActiveSection('chat');
    }
  }, [settings.chatbotSettings.enableNotes, settings.chatbotSettings.enableVoiceChat, activeSection]);

  const chatHeight = Math.max(600, Math.min(windowHeight - 100, 800));

  const style = {
    '--primary-color': settings.format.primaryColor,
    '--font-family': settings.format.fontFamily,
    '--font-size': settings.format.fontSize,
  } as React.CSSProperties;

  return (
    <div 
      className="fixed bottom-20 right-4 bg-white rounded-lg shadow-xl"
      style={{ 
        height: `${chatHeight}px`,
        width: '800px',
        maxWidth: 'calc(100vw - 2rem)',
        ...style
      }}
    >
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-16 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4 rounded-l-lg">
          <button
            onClick={() => setActiveSection('chat')}
            className={`p-3 rounded-lg mb-2 ${
              activeSection === 'chat' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Chat"
          >
            <MessageCircle size={24} />
          </button>
          
          {settings.chatbotSettings.enableNotes && (
            <button
              onClick={() => setActiveSection('notes')}
              className={`p-3 rounded-lg mb-2 ${
                activeSection === 'notes' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Notes"
            >
              <Pencil size={24} />
            </button>
          )}
          
          {settings.chatbotSettings.enableVoiceChat && settings.chatbotSettings.voiceChatEmbed && (
            <button
              onClick={() => setActiveSection('voice')}
              className={`p-3 rounded-lg ${
                activeSection === 'voice' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Voice Chat"
            >
              <Mic size={24} />
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">
              {activeSection === 'chat' && settings.chatbotSettings.name}
              {activeSection === 'notes' && 'Notes'}
              {activeSection === 'voice' && 'Voice Chat'}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {activeSection === 'chat' && (
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg, index) => (
                    <ChatMessage key={index} message={msg.text} isBot={msg.isBot} />
                  ))}
                  {isProcessing && (
                    <div className="flex items-center space-x-2 text-gray-500">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-400 px-4 pb-2 text-center">
                  Last Deployed: {new Date().toLocaleString()}
                </div>
                <ChatInput onSendMessage={onSendMessage} />
              </div>
            )}
            
            {activeSection === 'notes' && settings.chatbotSettings.enableNotes && (
              <NotesSection />
            )}
            
            {activeSection === 'voice' && settings.chatbotSettings.enableVoiceChat && (
              <VoiceChatSection embedCode={settings.chatbotSettings.voiceChatEmbed} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};