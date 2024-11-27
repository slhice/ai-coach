import React, { useState } from 'react';
import { ChatButton } from './components/ChatWidget/ChatButton';
import { ChatWindow } from './components/ChatWidget/ChatWindow';
import { Message } from './types/chat';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi there! How can I help you today?", isBot: true }
  ]);

  const handleSendMessage = (message: string) => {
    // Add user message
    setMessages(prev => [...prev, { text: message, isBot: false }]);
    
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "Thanks for your message! I'm here to help you with your course material.",
        isBot: true
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Your main content goes here */}
      <div className="p-8">
        <h1 className="text-2xl font-bold">Main Course Content</h1>
        <p className="mt-4">This is where your course content would be displayed.</p>
      </div>

      {/* Chat Widget */}
      {isOpen && (
        <ChatWindow
          messages={messages}
          onClose={() => setIsOpen(false)}
          onSendMessage={handleSendMessage}
        />
      )}
      <ChatButton onClick={() => setIsOpen(true)} />
    </div>
  );
}

export default App;