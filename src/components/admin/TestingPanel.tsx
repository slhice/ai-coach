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
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
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
        config.app.name || 'AI Coach',
        config.knowledge?.sources?.map((s: any) => s.content).join('\n\n') || ''
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
      {/* Rest of the component remains the same */}
    </div>
  );
};