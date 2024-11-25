import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, GraduationCap } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isAI: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isAI }) => {
  const [config, setConfig] = useState(() => {
    const savedConfig = localStorage.getItem('aiCoachConfig');
    return savedConfig ? JSON.parse(savedConfig) : {
      style: {
        primaryColor: '#3B82F6',
        icon: null
      }
    };
  });

  // Listen for config changes
  React.useEffect(() => {
    const handleStorageChange = () => {
      const newConfig = localStorage.getItem('aiCoachConfig');
      if (newConfig) {
        setConfig(JSON.parse(newConfig));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start space-x-3 ${isAI ? 'justify-start' : 'justify-end'}`}
    >
      {isAI && (
        <div 
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ 
            backgroundColor: `${config.style.primaryColor}`,
            color: 'white'
          }}
        >
          {config.style.icon ? (
            <img 
              src={config.style.icon} 
              alt="AI Coach" 
              className="w-5 h-5"
            />
          ) : (
            <GraduationCap className="w-5 h-5" />
          )}
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isAI 
            ? 'bg-white text-gray-800 shadow-md' 
            : 'text-white'
        }`}
        style={!isAI ? { backgroundColor: config.style.primaryColor } : undefined}
      >
        <p className="text-sm">{message}</p>
      </div>
      {!isAI && (
        <div 
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: config.style.primaryColor }}
        >
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </motion.div>
  );
};