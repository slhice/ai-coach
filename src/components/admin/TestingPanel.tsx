import React, { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { createTutoringChain } from '../../lib/aiConfig';

interface TestingPanelProps {
  config: any;
  setConfig: (config: any) => void;
}

export const TestingPanel: React.FC<TestingPanelProps> = ({ config }) => {
  const [testQuestion, setTestQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const testAI = async () => {
    if (!config.app.openAIKey) {
      setError('Please configure your OpenAI API key first');
      return;
    }

    if (!testQuestion.trim()) {
      setError('Please enter a test question');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const chain = createTutoringChain(
        config.app.name,
        config.knowledge.sources.map((s: any) => s.content).join('\n\n'),
        config.app.openAIKey
      );

      if (!chain) {
        throw new Error('Failed to initialize AI chain');
      }

      const result = await chain.invoke(testQuestion);
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while testing');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Test & Refine</h3>
        <p className="mt-1 text-sm text-gray-500">
          Test your AI coach's responses and refine its knowledge.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="testQuestion" className="block text-sm font-medium text-gray-700">
            Test Question
          </label>
          <div className="mt-1 flex gap-2">
            <input
              type="text"
              id="testQuestion"
              value={testQuestion}
              onChange={(e) => setTestQuestion(e.target.value)}
              placeholder="Ask a test question..."
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              onClick={testAI}
              disabled={isLoading || !testQuestion.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {isLoading ? 'Testing...' : 'Test'}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {response && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Response
            </label>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{response}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};