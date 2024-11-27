import React from 'react';
import { AdminSettings } from '../../../types/admin';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ApiKeyTabProps {
  settings: AdminSettings;
  onUpdate: (settings: AdminSettings) => void;
}

export const ApiKeyTab: React.FC<ApiKeyTabProps> = ({ settings, onUpdate }) => {
  const envApiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const isApiKeyConfigured = Boolean(envApiKey);

  const handleApiKeyChange = (apiKey: string) => {
    onUpdate({
      ...settings,
      apiKey
    });
  };

  if (isApiKeyConfigured) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-4">API Key Configuration</h3>
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle2 size={20} />
            <span className="font-medium">API Key Configured</span>
          </div>
          <p className="mt-2 text-sm text-green-600">
            The API key is securely configured through environment variables.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">API Key Configuration</h3>
      <div className="space-y-4">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-700">
            <AlertCircle size={20} />
            <span className="font-medium">API Key Not Configured</span>
          </div>
          <p className="mt-2 text-sm text-yellow-600">
            For security reasons, the API key should be configured through environment variables.
            Please set the VITE_OPENAI_API_KEY environment variable in your deployment platform.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Temporary API Key (Development Only)
          </label>
          <input
            type="password"
            value={settings.apiKey}
            onChange={(e) => handleApiKeyChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your API key for development"
          />
          <p className="mt-2 text-sm text-gray-500">
            Warning: This is only for development purposes. In production, always use environment variables.
          </p>
        </div>
      </div>
    </div>
  );
};