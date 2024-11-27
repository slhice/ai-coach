import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useAdminSettings } from '../../contexts/AdminSettingsContext';

interface ChatButtonProps {
  onClick: () => void;
}

export const ChatButton: React.FC<ChatButtonProps> = ({ onClick }) => {
  const { settings } = useAdminSettings();

  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      style={{ backgroundColor: settings.format.primaryColor }}
    >
      {settings.format.chatbotIcon ? (
        <img
          src={settings.format.chatbotIcon}
          alt="Chat"
          className="w-6 h-6"
        />
      ) : (
        <MessageCircle size={24} />
      )}
    </button>
  );
};