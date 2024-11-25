import React, { useState } from 'react';
import { AlertCircle, Check, Mic } from 'lucide-react';

interface AppConfigProps {
  config: any;
  setConfig: (config: any) => void;
}

export const AppConfig: React.FC<AppConfigProps> = ({ config, setConfig }) => {
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testError, setTestError] = useState('');
  const [showWidgetTest, setShowWidgetTest] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setConfig({
      ...config,
      app: {
        ...config.app,
        [e.target.name]: e.target.value
      }
    });
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({
      ...config,
      app: {
        ...config.app,
        [e.target.name]: e.target.checked
      }
    });
  };

  const handleVoiceChatToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({
      ...config,
      app: {
        ...config.app,
        voiceChatEnabled: e.target.checked,
        synthflowWidgetId: e.target.checked ? config.app.synthflowWidgetId : ''
      }
    });
    setShowWidgetTest(false);
    setTestStatus('idle');
  };

  const extractSynthflowUrl = (embedCode: string) => {
    try {
      const match = embedCode.match(/src="([^"]+)"/);
      if (!match) return null;
      
      const url = match[1];
      if (!url.includes('widget.synthflow.ai')) return null;
      
      return url;
    } catch {
      return null;
    }
  };

  const testSynthflowConnection = async () => {
    setTestStatus('testing');
    setTestError('');
    setShowWidgetTest(false);

    try {
      const embedCode = config.app.synthflowWidgetId;
      const widgetUrl = extractSynthflowUrl(embedCode);
      
      if (!widgetUrl) {
        throw new Error('Please enter a valid Synthflow embed code. Copy the entire <iframe> tag from Synthflow.');
      }

      setConfig({
        ...config,
        app: {
          ...config.app,
          synthflowWidgetId: embedCode
        }
      });

      setTestStatus('success');
      setShowWidgetTest(true);
    } catch (error) {
      setTestStatus('error');
      setTestError(error instanceof Error ? error.message : 'Failed to validate Synthflow widget');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Application Settings</h3>
        <p className="mt-1 text-sm text-gray-500">
          Configure the basic information about your AI coach application.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Application Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={config.app.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder=""
          />
        </div>

        <div>
          <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
            Organization
          </label>
          <input
            type="text"
            name="organization"
            id="organization"
            value={config.app.organization}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder=""
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={config.app.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder=""
          />
        </div>

        <div className="space-y-4">
          <div className="relative flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="showNotesEnabled"
                name="showNotesEnabled"
                type="checkbox"
                checked={config.app.showNotesEnabled ?? true}
                onChange={handleToggle}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="showNotesEnabled" className="font-medium text-gray-700">
                Enable Notes Feature
              </label>
              <p className="text-gray-500">Allow users to take and manage notes during conversations</p>
            </div>
          </div>

          <div className="relative flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="voiceChatEnabled"
                name="voiceChatEnabled"
                type="checkbox"
                checked={config.app.voiceChatEnabled}
                onChange={handleVoiceChatToggle}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="voiceChatEnabled" className="font-medium text-gray-700">
                Enable Voice Chat
              </label>
              <p className="text-gray-500">Add voice interaction capabilities using Synthflow</p>
            </div>
          </div>
        </div>

        {config.app.voiceChatEnabled && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="synthflowWidgetId" className="block text-sm font-medium text-gray-700">
                Paste Synthflow Embed Code
              </label>
              <button
                onClick={testSynthflowConnection}
                disabled={!config.app.synthflowWidgetId || testStatus === 'testing'}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Test Connection
              </button>
            </div>
            <div className="relative">
              <textarea
                name="synthflowWidgetId"
                id="synthflowWidgetId"
                value={config.app.synthflowWidgetId}
                onChange={handleChange}
                placeholder='<iframe src="https://widget.synthflow.ai/widget/v2/..." allow="microphone" ...></iframe>'
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
              />
            </div>
            
            {testStatus === 'success' && (
              <div className="space-y-4">
                <div className="rounded-md bg-green-50 p-3 flex items-center">
                  <Check className="h-5 w-5 text-green-400 mr-2" />
                  <p className="text-sm text-green-700">Widget configuration validated!</p>
                </div>

                {showWidgetTest && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center space-x-2 mb-4">
                      <Mic className="w-5 h-5 text-blue-600" />
                      <h4 className="text-sm font-medium text-gray-700">Test Voice Preview</h4>
                    </div>
                    <div className="w-full" style={{ height: '600px' }}>
                      <iframe 
                        src={extractSynthflowUrl(config.app.synthflowWidgetId) || ''}
                        allow="microphone"
                        className="w-full h-full rounded-md border"
                        style={{ background: 'transparent' }}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Try speaking to test the voice interaction. The widget should respond if properly configured.
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {testStatus === 'error' && (
              <div className="rounded-md bg-red-50 p-3 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-sm text-red-700">{testError}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};