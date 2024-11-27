import React from 'react';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot }) => {
  // Convert the message text into formatted HTML
  const formatMessage = (text: string) => {
    // Split text into paragraphs
    return text.split('\n').map((paragraph, index) => {
      // Check if the paragraph is a bullet point
      if (paragraph.trim().startsWith('-') || paragraph.trim().startsWith('•')) {
        return (
          <li key={index} className="ml-4">
            {paragraph.trim().substring(1).trim()}
          </li>
        );
      }
      // Check if it's a numbered point
      if (/^\d+\./.test(paragraph.trim())) {
        return (
          <li key={index} className="ml-4 list-decimal">
            {paragraph.trim().substring(paragraph.indexOf('.') + 1).trim()}
          </li>
        );
      }
      // Regular paragraph
      return paragraph.trim() && <p key={index} className="mb-2">{paragraph}</p>;
    });
  };

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-[80%] p-3 rounded-lg ${
          isBot
            ? 'bg-white text-gray-800 rounded-bl-none'
            : 'bg-blue-600 text-white rounded-br-none'
        }`}
      >
        <div className="text-sm whitespace-pre-wrap">
          {formatMessage(message)}
        </div>
      </div>
    </div>
  );
};