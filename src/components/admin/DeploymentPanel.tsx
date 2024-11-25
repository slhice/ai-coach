import React, { useState } from 'react';
import { Save, ExternalLink, AlertCircle, Check } from 'lucide-react';

interface DeploymentPanelProps {
  config: any;
  setConfig: (config: any) => void;
}

export const DeploymentPanel: React.FC<DeploymentPanelProps> = ({ config }) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<{
    success?: boolean;
    error?: string;
    url?: string;
  }>({});

  const validateConfig = () => {
    const errors = [];
    
    if (!config.app.openAIKey) {
      errors.push('OpenAI API key is required');
    }
    
    if (!config.app.name) {
      errors.push('Application name is required');
    }

    if (config.app.voiceChatEnabled && !config.app.synthflowWidgetId) {
      errors.push('Synthflow Widget ID is required when voice chat is enabled');
    }

    return errors;
  };

  const handleDeploy = async () => {
    const errors = validateConfig();
    if (errors.length > 0) {
      setDeploymentStatus({
        success: false,
        error: `Please fix the following issues:\n${errors.join('\n')}`
      });
      return;
    }

    setIsDeploying(true);
    setDeploymentStatus({});

    try {
      // Save configuration
      localStorage.setItem('aiCoachConfig', JSON.stringify(config));

      // Trigger deployment
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: {
            ...config,
            app: {
              ...config.app,
              openAIKey: '***' // Don't send API key to deployment service
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error('Deployment failed');
      }

      const data = await response.json();
      
      setDeploymentStatus({
        success: true,
        url: data.url
      });
    } catch (error) {
      setDeploymentStatus({
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred during deployment'
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Save & Deploy</h3>
        <p className="mt-1 text-sm text-gray-500">
          Save your configuration and deploy your AI coach application.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Before deploying</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Ensure all required fields are filled</li>
                  <li>Test your AI responses in the Test & Refine section</li>
                  <li>Review your knowledge sources</li>
                  <li>Check your style customizations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleDeploy}
            disabled={isDeploying}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5 mr-2" />
            {isDeploying ? 'Deploying...' : 'Save & Deploy'}
          </button>
        </div>

        {deploymentStatus.success && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <Check className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Deployment successful!
                </h3>
                {deploymentStatus.url && (
                  <div className="mt-2 text-sm text-green-700">
                    <p>Your AI coach is now live at:</p>
                    <a
                      href={deploymentStatus.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 flex items-center text-blue-600 hover:text-blue-800"
                    >
                      {deploymentStatus.url}
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {deploymentStatus.error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Deployment failed
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{deploymentStatus.error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};