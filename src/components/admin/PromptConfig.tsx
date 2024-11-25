import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface PromptConfigProps {
  config: any;
  setConfig: (config: any) => void;
}

export const PromptConfig: React.FC<PromptConfigProps> = ({ config, setConfig }) => {
  const [newApproach, setNewApproach] = useState('');

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setConfig({
      ...config,
      coaching: {
        ...config.coaching,
        prompt: e.target.value
      }
    });
  };

  const handleGreetingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setConfig({
      ...config,
      coaching: {
        ...config.coaching,
        greeting: e.target.value
      }
    });
  };

  const addApproach = () => {
    if (newApproach.trim()) {
      setConfig({
        ...config,
        coaching: {
          ...config.coaching,
          approach: [...(config.coaching?.approach || []), newApproach.trim()]
        }
      });
      setNewApproach('');
    }
  };

  const removeApproach = (index: number) => {
    setConfig({
      ...config,
      coaching: {
        ...config.coaching,
        approach: config.coaching.approach.filter((_: any, i: number) => i !== index)
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Coaching Approach</h3>
        <p className="mt-1 text-sm text-gray-500">
          Configure how your AI coach should interact with and teach students.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="greeting" className="block text-sm font-medium text-gray-700">
            Initial Greeting
          </label>
          <p className="mt-1 text-sm text-gray-500">
            This is the first message students will see when starting a conversation.
          </p>
          <textarea
            id="greeting"
            name="greeting"
            rows={2}
            value={config.coaching?.greeting || "Hello! I'm your AI Coach. How can I help you learn and grow today?"}
            onChange={handleGreetingChange}
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Hello! I'm your AI Coach. How can I help you learn and grow today?"
          />
        </div>

        <div>
          <label htmlFor="basePrompt" className="block text-sm font-medium text-gray-700">
            Base Teaching Prompt
          </label>
          <p className="mt-1 text-sm text-gray-500">
            This is the foundation of how your AI coach will respond to questions.
          </p>
          <textarea
            id="basePrompt"
            name="basePrompt"
            rows={6}
            value={config.coaching?.prompt || ''}
            onChange={handlePromptChange}
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="You are an expert tutor specializing in [subject]. Your role is to guide students through complex concepts by..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Teaching Approaches</label>
          <p className="mt-1 text-sm text-gray-500">
            Add specific teaching methods and approaches your AI coach should use.
          </p>
          
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={newApproach}
              onChange={(e) => setNewApproach(e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Use real-world examples"
            />
            <button
              onClick={addApproach}
              disabled={!newApproach.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {config.coaching?.approach?.map((approach: string, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group"
              >
                <span className="text-sm text-gray-700">{approach}</span>
                <button
                  onClick={() => removeApproach(index)}
                  className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {(!config.coaching?.approach || config.coaching.approach.length === 0) && (
              <p className="text-sm text-gray-500 italic">
                No teaching approaches added yet
              </p>
            )}
          </div>
        </div>

        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Example Approaches</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Break down complex concepts into simpler parts</li>
                  <li>Use analogies and metaphors for better understanding</li>
                  <li>Provide step-by-step explanations</li>
                  <li>Include practical, real-world examples</li>
                  <li>Ask guiding questions to promote critical thinking</li>
                  <li>Offer positive reinforcement and encouragement</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};