import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface BehaviourConfigProps {
  config: any;
  setConfig: (config: any) => void;
}

export const BehaviourConfig: React.FC<BehaviourConfigProps> = ({ config, setConfig }) => {
  const [newGuideline, setNewGuideline] = useState('');

  const handleBehaviourChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setConfig({
      ...config,
      coaching: {
        ...config.coaching,
        behaviour: e.target.value
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

  const addGuideline = () => {
    if (newGuideline.trim()) {
      setConfig({
        ...config,
        coaching: {
          ...config.coaching,
          guidelines: [...(config.coaching?.guidelines || []), newGuideline.trim()]
        }
      });
      setNewGuideline('');
    }
  };

  const removeGuideline = (index: number) => {
    setConfig({
      ...config,
      coaching: {
        ...config.coaching,
        guidelines: config.coaching.guidelines.filter((_: any, i: number) => i !== index)
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">AI Coach Behaviour</h3>
        <p className="mt-1 text-sm text-gray-500">
          Configure how your AI coach should interact with users and handle conversations.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="greeting" className="block text-sm font-medium text-gray-700">
            Initial Greeting
          </label>
          <p className="mt-1 text-sm text-gray-500">
            The first message users will see when starting a conversation.
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
          <label htmlFor="behaviour" className="block text-sm font-medium text-gray-700">
            Core Behaviour
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Define the core behaviour and personality of your AI coach.
          </p>
          <textarea
            id="behaviour"
            name="behaviour"
            rows={6}
            value={config.coaching?.behaviour || ''}
            onChange={handleBehaviourChange}
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="You are an expert coach who helps users by..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Response Guidelines</label>
          <p className="mt-1 text-sm text-gray-500">
            Add specific guidelines for how the AI should structure its responses.
          </p>
          
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={newGuideline}
              onChange={(e) => setNewGuideline(e.target.value)}
              placeholder="e.g., Always provide examples"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              onClick={addGuideline}
              disabled={!newGuideline.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {config.coaching?.guidelines?.map((guideline: string, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group"
              >
                <span className="text-sm text-gray-700">{guideline}</span>
                <button
                  onClick={() => removeGuideline(index)}
                  className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {(!config.coaching?.guidelines || config.coaching.guidelines.length === 0) && (
              <p className="text-sm text-gray-500 italic">
                No guidelines added yet
              </p>
            )}
          </div>
        </div>

        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Example Guidelines</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Start responses with a brief acknowledgment</li>
                  <li>Use clear, concise language</li>
                  <li>Include practical examples when possible</li>
                  <li>Break down complex topics into steps</li>
                  <li>End responses with a follow-up question</li>
                  <li>Maintain a supportive and encouraging tone</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};