import React, { useState, useEffect } from 'react';
import { ChatButton } from '../components/ChatWidget/ChatButton';
import { ChatWindow } from '../components/ChatWidget/ChatWindow';
import { Message } from '../types/chat';
import { useAdminSettings } from '../contexts/AdminSettingsContext';
import { conversationService } from '../services/conversationService';
import { chatService } from '../services/chatService';

export const MainLayout: React.FC = () => {
  const { settings } = useAdminSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: settings.chatbotSettings.initialGreeting, isBot: true }
  ]);
  const [currentConversationId] = useState(`conv-${Date.now()}`);
  const [hasUserMessaged, setHasUserMessaged] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const conversations = conversationService.getConversations();
    const currentConversation = conversations.find(conv => conv.id === currentConversationId);
    
    if (currentConversation) {
      setMessages(currentConversation.messages);
      setHasUserMessaged(currentConversation.messages.some(msg => !msg.isBot));
    }
  }, [currentConversationId]);

  useEffect(() => {
    if (!hasUserMessaged) return;

    const conversations = conversationService.getConversations();
    const conversation = {
      id: currentConversationId,
      timestamp: new Date(),
      messages: messages.map(msg => ({
        ...msg,
        timestamp: new Date()
      }))
    };

    const existingIndex = conversations.findIndex(conv => conv.id === currentConversationId);
    if (existingIndex >= 0) {
      conversations[existingIndex] = conversation;
    } else {
      conversations.push(conversation);
    }

    conversationService.saveConversations(conversations);
  }, [messages, currentConversationId, hasUserMessaged]);

  const handleSendMessage = async (message: string) => {
    setHasUserMessaged(true);
    setMessages(prev => [...prev, { text: message, isBot: false }]);
    setIsProcessing(true);

    try {
      const response = await chatService.processMessage(message, settings);
      setTimeout(() => {
        setMessages(prev => [...prev, { text: response, isBot: true }]);
        setIsProcessing(false);
      }, settings.chatbotSettings.responseDelay);
    } catch (error) {
      console.error('Error processing message:', error);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: "I apologize, but I'm having trouble processing your request at the moment. Please try again later.",
          isBot: true
        }]);
        setIsProcessing(false);
      }, settings.chatbotSettings.responseDelay);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-8">
        <h1 className="text-2xl font-bold">Main Course Content</h1>
        <p className="mt-4">This is where your course content would be displayed.</p>
      </div>

      {isOpen && (
        <ChatWindow
          messages={messages}
          onClose={() => setIsOpen(false)}
          onSendMessage={handleSendMessage}
          settings={settings}
          isProcessing={isProcessing}
        />
      )}
      <ChatButton onClick={() => setIsOpen(true)} />
    </div>
  );
};