import React, { useState, useEffect } from 'react';
import { X, Save, CheckCircle2 } from 'lucide-react';
import { AdminTab } from '../../types/admin';
import { ApiKeyTab } from './tabs/ApiKeyTab';
import { ChatbotSettingsTab } from './tabs/ChatbotSettingsTab';
import { FormatTab } from './tabs/FormatTab';
import { ResponseStyleTab } from './tabs/ResponseStyleTab';
import { KnowledgeSourcesTab } from './tabs/KnowledgeSourcesTab';
import { ConversationsTab } from './tabs/ConversationsTab';
import { SecurityTab } from './tabs/SecurityTab';
import { useAdminSettings } from '../../contexts/AdminSettingsContext';

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const { settings, updateSettings } = useAdminSettings();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('apiKey');
  const [error, setError] = useState('');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  useEffect(() => {
    if (showSaveSuccess) {
      const timer = setTimeout(() => {
        setShowSaveSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSaveSuccess]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === settings.security.password) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handleSave = () => {
    updateSettings(settings);
    setShowSaveSuccess(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-96">
          <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabs: { id: AdminTab; label: string }[] = [
    { id: 'apiKey', label: 'API Key' },
    { id: 'chatbotSettings', label: 'Chatbot Settings' },
    { id: 'format', label: 'Format' },
    { id: 'responseStyle', label: 'Response Style' },
    { id: 'knowledgeSource', label: 'Knowledge Sources' },
    { id: 'conversations', label: 'Conversations' },
    { id: 'security', label: 'Security' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg shadow-xl w-[900px] max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <div className="flex items-center gap-2">
            {showSaveSuccess && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <CheckCircle2 size={16} />
                <span className="text-sm">Changes saved!</span>
              </div>
            )}
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Save size={16} />
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          <div className="w-48 border-r overflow-y-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'apiKey' && (
              <ApiKeyTab
                settings={settings}
                onUpdate={updateSettings}
              />
            )}
            {activeTab === 'chatbotSettings' && (
              <ChatbotSettingsTab
                settings={settings}
                onUpdate={updateSettings}
              />
            )}
            {activeTab === 'format' && (
              <FormatTab
                settings={settings}
                onUpdate={updateSettings}
              />
            )}
            {activeTab === 'responseStyle' && (
              <ResponseStyleTab
                settings={settings}
                onUpdate={updateSettings}
              />
            )}
            {activeTab === 'knowledgeSource' && (
              <KnowledgeSourcesTab
                settings={settings}
                onUpdate={updateSettings}
              />
            )}
            {activeTab === 'conversations' && (
              <ConversationsTab
                settings={settings}
                onUpdate={updateSettings}
              />
            )}
            {activeTab === 'security' && (
              <SecurityTab
                settings={settings}
                onUpdate={updateSettings}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};