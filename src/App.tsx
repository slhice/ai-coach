import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { ChatContainer } from './components/ChatContainer';
import { NotesPanel } from './components/NotesPanel';
import { VirtualChatPanel } from './components/VirtualChatPanel';
import { Message } from './types';
import { createTutoringChain, loadCustomKnowledgeBase } from './lib/aiConfig';

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const [config, setConfig] = useState(() => {
    const savedConfig = localStorage.getItem('aiCoachConfig');
    return savedConfig ? JSON.parse(savedConfig) : {
      app: {
        name: 'AI Coach',
        voiceChatEnabled: false,
        synthflowWidgetId: '',
        showNotesEnabled: true
      },
      style: {
        primaryColor: '#3B82F6',
        icon: null
      },
      coaching: {
        greeting: "Hello! I'm your AI Coach. How can I help you learn and grow today?"
      }
    };
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const initialMessage = {
      text: config.coaching?.greeting || "Hello! I'm your AI Coach. How can I help you learn and grow today?",
      isAI: true,
      timestamp: new Date().toISOString()
    };
    
    // Start a new conversation
    const conversation = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      messages: [initialMessage]
    };
    
    // Get existing conversations or initialize empty array
    const conversations = JSON.parse(localStorage.getItem('aiCoachConversations') || '[]');
    conversations.push(conversation);
    localStorage.setItem('aiCoachConversations', JSON.stringify(conversations));
    
    return [initialMessage];
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showVirtualChat, setShowVirtualChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [tutoringChain, setTutoringChain] = useState<any>(null);

  // Listen for config changes
  useEffect(() => {
    const handleStorageChange = () => {
      const newConfig = localStorage.getItem('aiCoachConfig');
      if (newConfig) {
        setConfig(JSON.parse(newConfig));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const initAI = async () => {
      try {
        const sources = [
          'https://path-to-your-course-material.pdf',
          'https://your-documentation-url.com',
        ];
        
        const context = await loadCustomKnowledgeBase(sources);
        const chain = createTutoringChain(
          'Your Subject', 
          context,
          config.app.openAIKey
        );
        setTutoringChain(chain);
      } catch (error) {
        console.error('Error initializing AI:', error);
      }
    };

    if (config.app.openAIKey) {
      initAI();
    }
  }, [config.app.openAIKey]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewMessage = (text: string, isAI: boolean) => {
    const newMessage = {
      text,
      isAI,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Update conversation in localStorage
    const conversations = JSON.parse(localStorage.getItem('aiCoachConversations') || '[]');
    const currentConversation = conversations[conversations.length - 1];
    currentConversation.messages.push(newMessage);
    localStorage.setItem('aiCoachConversations', JSON.stringify(conversations));
  };

  const generateAIResponse = async (userInput: string) => {
    if (!config.app.openAIKey) {
      handleNewMessage("Please configure your OpenAI API key in the admin panel first.", true);
      return;
    }

    setIsProcessing(true);
    try {
      let response;
      if (tutoringChain) {
        response = await tutoringChain.invoke(userInput);
      } else {
        response = "I apologize, but I'm not fully configured yet. Please ensure the API key is properly set up in the admin panel.";
      }
      handleNewMessage(response, true);
    } catch (error) {
      console.error('Error generating response:', error);
      handleNewMessage(
        "I apologize, but I'm having trouble accessing my knowledge base. Please try again.",
        true
      );
    }
    setIsProcessing(false);
  };

  const handleSpeechResult = useCallback((transcript: string) => {
    handleNewMessage(transcript, false);
    generateAIResponse(transcript);
  }, [tutoringChain]);

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header 
        showNotes={showNotes} 
        showVirtualChat={showVirtualChat}
        onToggleNotes={() => {
          setShowNotes(!showNotes);
          setShowVirtualChat(false);
        }}
        onToggleVirtualChat={() => {
          setShowVirtualChat(!showVirtualChat);
          setShowNotes(false);
        }}
        voiceChatEnabled={config.app.voiceChatEnabled}
        appName={config.app.name}
        showNotesEnabled={config.app.showNotesEnabled}
      />
      
      <main className="flex-1 p-4 overflow-hidden">
        <div className="h-full flex space-x-4">
          <ChatContainer
            messages={messages}
            showNotes={showNotes || showVirtualChat}
            isProcessing={isProcessing}
            onSpeechResult={handleSpeechResult}
            messagesEndRef={messagesEndRef}
          />

          <AnimatePresence>
            {showNotes && config.app.showNotesEnabled && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-1/3"
              >
                <NotesPanel messages={messages} />
              </motion.div>
            )}
            {showVirtualChat && config.app.voiceChatEnabled && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-1/3"
              >
                <VirtualChatPanel synthflowWidgetId={config.app.synthflowWidgetId} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default App;