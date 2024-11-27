import React, { useState } from 'react';
import { AdminSettings } from '../../../types/admin';
import { Plus, X, Download } from 'lucide-react';

interface ResponseStyleTabProps {
  settings: AdminSettings;
  onUpdate: (settings: AdminSettings) => void;
}

export const ResponseStyleTab: React.FC<ResponseStyleTabProps> = ({
  settings,
  onUpdate,
}) => {
  const [newInstruction, setNewInstruction] = useState('');

  const handleChange = (field: keyof typeof settings.responseStyle, value: string | string[]) => {
    onUpdate({
      ...settings,
      responseStyle: {
        ...settings.responseStyle,
        [field]: value,
      },
    });
  };

  const handleAddInstruction = () => {
    if (newInstruction.trim()) {
      handleChange('instructions', [...(settings.responseStyle.instructions || []), newInstruction.trim()]);
      setNewInstruction('');
    }
  };

  const handleRemoveInstruction = (index: number) => {
    const newInstructions = settings.responseStyle.instructions.filter((_, i) => i !== index);
    handleChange('instructions', newInstructions);
  };

  const handleUpdateInstruction = (index: number, value: string) => {
    const newInstructions = [...settings.responseStyle.instructions];
    newInstructions[index] = value;
    handleChange('instructions', newInstructions);
  };

  const exportSettings = () => {
    const exportData = {
      tone: settings.responseStyle.tone,
      responseLength: settings.responseStyle.length,
      language: settings.responseStyle.language,
      basePrompt: settings.responseStyle.basePrompt,
      instructions: settings.responseStyle.instructions,
    };

    // ChatGPT format
    const chatGPTPrompt = `${exportData.basePrompt}

Tone: ${exportData.tone}
Response Length: ${exportData.responseLength}
Language: ${exportData.language}

Teaching Approach Instructions:
${exportData.instructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n')}`;

    // Synthflow format
    const synthflowFormat = {
      assistant_config: {
        base_prompt: exportData.basePrompt,
        personality: {
          tone: exportData.tone,
          verbosity: exportData.responseLength,
          language: exportData.language,
        },
        instructions: exportData.instructions,
      },
    };

    const blob = new Blob([
      'ChatGPT Format:\n\n',
      chatGPTPrompt,
      '\n\n---\n\nSynthflow Format:\n\n',
      JSON.stringify(synthflowFormat, null, 2)
    ], { type: 'text/plain' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-assistant-settings.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Response Style Settings</h3>
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Teaching Prompt
            </label>
            <textarea
              value={settings.responseStyle.basePrompt}
              onChange={(e) => handleChange('basePrompt', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded h-32"
              placeholder="Enter the foundational prompt that defines the AI's teaching role and approach..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tone
            </label>
            <select
              value={settings.responseStyle.tone}
              onChange={(e) => handleChange('tone', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="friendly">Friendly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Response Length
            </label>
            <select
              value={settings.responseStyle.length}
              onChange={(e) => handleChange('length', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="concise">Concise</option>
              <option value="detailed">Detailed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <input
              type="text"
              value={settings.responseStyle.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter preferred language"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Teaching Approach
            </label>
            <button
              onClick={exportSettings}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              title="Export settings for ChatGPT and Synthflow"
            >
              <Download size={16} />
              Export
            </button>
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={newInstruction}
              onChange={(e) => setNewInstruction(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded"
              placeholder="Add a new teaching approach instruction..."
            />
            <button
              onClick={handleAddInstruction}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          <div className="space-y-3">
            {settings.responseStyle.instructions?.map((instruction, index) => (
              <div key={index} className="relative group">
                <textarea
                  value={instruction}
                  onChange={(e) => handleUpdateInstruction(index, e.target.value)}
                  className="w-full p-3 pr-10 bg-gray-50 border border-gray-200 rounded resize-none min-h-[60px]"
                />
                <button
                  onClick={() => handleRemoveInstruction(index)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};