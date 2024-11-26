import React, { useState } from 'react';
import { Copy, ExternalLink } from 'lucide-react';
import { exportForChatGPT, exportForSynthflow } from '../../lib/knowledgeBaseConnector';
import { TutorConfig } from '../../types';

interface KnowledgeExportProps {
  config: TutorConfig;
}

export const KnowledgeExport: React.FC<KnowledgeExportProps> = ({ config }) => {
  const [copied, setCopied] = useState<'chatgpt' | 'synthflow' | null>(null);

  const handleCopy = async (type: 'chatgpt' | 'synthflow') => {
    const content = type === 'chatgpt' 
      ? exportForChatGPT(config)
      : exportForSynthflow(config);

    await navigator.clipboard.writeText(content);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Export Knowledge Base</h3>
        <p className="mt-1 text-sm text-gray-500">
          Export your knowledge base to use with ChatGPT or Synthflow
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">ChatGPT Custom Instructions</h4>
            <button
              onClick={() => handleCopy('chatgpt')}
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <Copy className="w-4 h-4" />
              <span>{copied === 'chatgpt' ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Copy these instructions to ChatGPT to create a custom AI tutor with your knowledge base.
          </p>
          <a 
            href="https://chat.openai.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
          >
            Open ChatGPT <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">Synthflow Configuration</h4>
            <button
              onClick={() => handleCopy('synthflow')}
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <Copy className="w-4 h-4" />
              <span>{copied === 'synthflow' ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Copy this configuration to your Synthflow widget settings to sync the knowledge base.
          </p>
          <a 
            href="https://widget.synthflow.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
          >
            Open Synthflow Dashboard <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>

      <div className="rounded-md bg-blue-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Usage Instructions</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ol className="list-decimal pl-5 space-y-1">
                <li>Copy the appropriate configuration</li>
                <li>For ChatGPT: Paste into custom instructions</li>
                <li>For Synthflow: Paste into widget system prompt</li>
                <li>Test with sample questions to verify knowledge</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};