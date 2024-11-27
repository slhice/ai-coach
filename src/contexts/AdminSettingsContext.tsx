import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminSettings } from '../types/admin';
import { adminService } from '../services/adminService';

const DEFAULT_SETTINGS: AdminSettings = {
  apiKey: '',
  chatbotSettings: {
    name: 'AI Coach',
    initialGreeting: 'Hi there! How can I help you today?',
    responseDelay: 1000,
  },
  format: {
    fontFamily: 'Inter',
    fontSize: '14px',
    primaryColor: '#2563eb',
    chatbotIcon: undefined,
  },
  responseStyle: {
    tone: 'professional',
    length: 'concise',
    language: 'English',
    basePrompt: 'You are an AI teaching assistant focused on helping students understand course material. Your responses should be educational, supportive, and aimed at fostering learning.',
    instructions: [],
  },
  knowledgeSource: {
    sources: [],
    customInstructions: '',
  },
  conversations: {
    maxHistory: 50,
    saveHistory: true,
    exportEnabled: true,
  },
  security: {
    password: 'admin123',
    maxAttempts: 3,
    lockoutDuration: 30,
    failedAttempts: 0,
  },
};

interface AdminSettingsContextType {
  settings: AdminSettings;
  updateSettings: (newSettings: AdminSettings) => void;
}

const AdminSettingsContext = createContext<AdminSettingsContextType | undefined>(undefined);

export const AdminSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const savedSettings = adminService.getSettings();
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);

  const updateSettings = (newSettings: AdminSettings) => {
    setSettings(newSettings);
    adminService.saveSettings(newSettings);
  };

  return (
    <AdminSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </AdminSettingsContext.Provider>
  );
};

export const useAdminSettings = () => {
  const context = useContext(AdminSettingsContext);
  if (context === undefined) {
    throw new Error('useAdminSettings must be used within an AdminSettingsProvider');
  }
  return context;
};