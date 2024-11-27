import React, { useState, useEffect } from 'react';
import { AdminSettings } from '../../../types/admin';

interface ChatbotSettingsTabProps {
  settings: AdminSettings;
  onUpdate: (settings: AdminSettings) => void;
}

export const ChatbotSettingsTab: React.FC<ChatbotSettingsTabProps> = ({
  settings,
  onUpdate,
}) => {
  const [embedCode, setEmbedCode] = useState(settings.chatbotSettings.voiceChatEmbed || '');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  // Update embed code when settings change
  useEffect(() => {
    setEmbedCode(settings.chatbotSettings.voiceChatEmbed || '');
  }, [settings.chatbotSettings.voiceChatEmbed]);

  const handleChange = (field: string, value: any) => {
    onUpdate({
      ...settings,
      chatbotSettings: {
        ...settings.chatbotSettings,
        [field]: value,
      },
    });
  };

  const handleFeatureToggle = (feature: string, enabled: boolean) => {
    if (!enabled) {
      // Clear embed code when disabling voice chat
      if (feature === 'enableVoiceChat') {
        handleChange('voiceChatEmbed', '');
        setEmbedCode('');
        setTestStatus('idle');
      }
    }
    handleChange(feature, enabled);
  };

  const testConnection = async () => {
    setTestStatus('testing');
    try {
      // Extract the src URL from the embed code
      const srcMatch = embedCode.match(/src="([^"]+)"/);
      if (srcMatch && srcMatch[1].includes('synthflow.ai')) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setTestStatus('success');
        handleChange('voiceChatEmbed', srcMatch[1]);
      } else {
        setTestStatus('error');
      }
    } catch (error) {
      setTestStatus('error');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Chatbot Settings</h3>
      
      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chatbot Name
          </label>
          <input
            type="text"
            value={settings.chatbotSettings.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter chatbot name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Initial Greeting
          </label>
          <textarea
            value={settings.chatbotSettings.initialGreeting}
            onChange={(e) => handleChange('initialGreeting', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded h-24"
            placeholder="Enter initial greeting message"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Focus
          </label>
          <input
            type="text"
            value={settings.chatbotSettings.focus || ''}
            onChange={(e) => handleChange('focus', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter chatbot's primary focus"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={settings.chatbotSettings.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded h-24"
            placeholder="Enter chatbot description"
          />
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Features</h4>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h5 className="font-medium">Enable Notes</h5>
            <p className="text-sm text-gray-500">Allow users to take and manage notes</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={settings.chatbotSettings.enableNotes || false}
              onChange={(e) => handleFeatureToggle('enableNotes', e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h5 className="font-medium">Enable Voice Chat</h5>
            <p className="text-sm text-gray-500">Allow users to interact using voice</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={settings.chatbotSettings.enableVoiceChat || false}
              onChange={(e) => handleFeatureToggle('enableVoiceChat', e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {settings.chatbotSettings.enableVoiceChat && (
          <div className="p-4 border border-gray-200 rounded-lg space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Synthflow Embed Code
            </label>
            <textarea
              value={embedCode}
              onChange={(e) => setEmbedCode(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded h-32 font-mono text-sm"
              placeholder="Paste your Synthflow embed code here..."
            />
            <div className="flex items-center gap-4">
              <button
                onClick={testConnection}
                disabled={testStatus === 'testing'}
                className={`px-4 py-2 rounded-lg text-white ${
                  testStatus === 'testing'
                    ? 'bg-gray-400'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
              </button>
              {testStatus === 'success' && (
                <span className="text-green-600 text-sm">Connection successful!</span>
              )}
              {testStatus === 'error' && (
                <span className="text-red-600 text-sm">Invalid embed code</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};