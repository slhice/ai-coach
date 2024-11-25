import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, X } from 'lucide-react';
import App from './App';

export const FloatingWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState(() => {
    const savedConfig = localStorage.getItem('aiCoachConfig');
    return savedConfig ? JSON.parse(savedConfig) : {
      style: {
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF'
      }
    };
  });

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('widget-open');
    } else {
      document.body.classList.remove('widget-open');
    }

    return () => {
      document.body.classList.remove('widget-open');
    };
  }, [isOpen]);

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

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
            style={{ maxWidth: '1200px', margin: 'auto' }}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <div className="w-full h-full overflow-auto">
              <App />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="rounded-full p-4 shadow-lg flex items-center justify-center transition-colors"
          style={{ 
            backgroundColor: config.style.primaryColor,
            color: 'white'
          }}
          aria-label="Open AI Coach"
        >
          {config.style.icon ? (
            <img 
              src={config.style.icon} 
              alt="AI Coach" 
              className="w-6 h-6"
            />
          ) : (
            <GraduationCap className="w-6 h-6" />
          )}
        </motion.button>
      )}
    </div>
  );
};