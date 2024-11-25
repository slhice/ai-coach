import React, { useState } from 'react';
import { Settings, Upload, Edit3, Link, TestTube, Save, Key, MessageSquare, Lock } from 'lucide-react';
import { AppConfig } from './AppConfig';
import { APIKeyConfig } from './APIKeyConfig';
import { StyleConfig } from './StyleConfig';
import { InstructionsConfig } from './InstructionsConfig';
import { ConversationLogs } from './ConversationLogs';
import { SecurityConfig } from './SecurityConfig';

export const AdminPanel: React.FC = () => {
  const [config, setConfig] = useState(() => {
    const savedConfig = localStorage.getItem('aiCoachConfig');
    return savedConfig ? JSON.parse(savedConfig) : {
      app: {
        name: 'AI Coach',
        description: '',
        organization: '',
        openAIKey: '',
        voiceChatEnabled: false,
        synthflowWidgetId: '',
        showNotesEnabled: true
      },
      style: {
        primaryColor: '#3B82F6',
        icon: null
      },
      coaching: {
        greeting: "Hello! I'm your AI Coach. How can I help you learn and grow today?",
        instructions: '',
        guidelines: []
      },
      admin: {
        password: 'admin123',
        maxLoginAttempts: 3,
        lockoutDuration: 15
      }
    };
  });

  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleSave = () => {
    localStorage.setItem('aiCoachConfig', JSON.stringify(config));
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleClose = () => {
    window.location.href = '/';
  };

  const tabs = [
    { name: 'API Key', icon: Key, component: APIKeyConfig },
    { name: 'App Settings', icon: Settings, component: AppConfig },
    { name: 'Style & Branding', icon: Edit3, component: StyleConfig },
    { name: 'Instructions', icon: Upload, component: InstructionsConfig },
    { name: 'Conversation Logs', icon: MessageSquare, component: ConversationLogs },
    { name: 'Security', icon: Lock, component: SecurityConfig }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow">
            <Tab.Group>
              <Tab.List className="flex p-1 space-x-1 bg-blue-900/5 rounded-t-lg">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    className={({ selected }) =>
                      `w-full py-2.5 text-sm leading-5 font-medium rounded-lg
                      ${selected 
                        ? 'bg-white text-blue-700 shadow'
                        : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
                      }`
                    }
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <tab.icon className="w-5 h-5" />
                      <span>{tab.name}</span>
                    </div>
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="p-6">
                {tabs.map((tab, idx) => (
                  <Tab.Panel key={idx}>
                    <tab.component 
                      config={config}
                      setConfig={setConfig}
                    />
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>

            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-4">
              {showSaveSuccess && (
                <div className="px-4 py-2 bg-green-100 text-green-800 rounded-md">
                  Changes saved successfully!
                </div>
              )}
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Close Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};