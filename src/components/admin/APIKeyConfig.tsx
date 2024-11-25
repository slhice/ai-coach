import React from 'react';
import { Key } from 'lucide-react';

export const APIKeyConfig: React.FC = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">OpenAI API Key Configuration</h3>
        <p className="mt-1 text-sm text-gray-500">
          The API key is configured through environment variables for security.
        </p>
      </div>

      <div className="rounded-md bg-blue-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Key className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">API Key Status</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>{apiKey ? 'API key is configured' : 'API key is not configured'}</p>
              <p className="mt-2">
                To update the API key, please modify the environment variables in your deployment settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};