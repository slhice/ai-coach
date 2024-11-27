import React, { useRef } from 'react';
import { AdminSettings } from '../../../types/admin';
import { Upload, X } from 'lucide-react';

interface FormatTabProps {
  settings: AdminSettings;
  onUpdate: (settings: AdminSettings) => void;
}

export const FormatTab: React.FC<FormatTabProps> = ({ settings, onUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof typeof settings.format, value: string | undefined) => {
    onUpdate({
      ...settings,
      format: {
        ...settings.format,
        [field]: value,
      },
    });
  };

  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('chatbotIcon', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveIcon = () => {
    handleChange('chatbotIcon', undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Format Settings</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chatbot Icon
          </label>
          <div className="space-y-2">
            {settings.format.chatbotIcon ? (
              <div className="relative w-16 h-16">
                <img
                  src={settings.format.chatbotIcon}
                  alt="Chatbot icon"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={handleRemoveIcon}
                  className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <Upload size={24} className="text-gray-400" />
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleIconUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Upload Icon
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Font Family
          </label>
          <select
            value={settings.format.fontFamily}
            onChange={(e) => handleChange('fontFamily', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="Inter">Inter</option>
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Font Size
          </label>
          <select
            value={settings.format.fontSize}
            onChange={(e) => handleChange('fontSize', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="12px">Small (12px)</option>
            <option value="14px">Medium (14px)</option>
            <option value="16px">Large (16px)</option>
            <option value="18px">Extra Large (18px)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Primary Color
          </label>
          <input
            type="color"
            value={settings.format.primaryColor}
            onChange={(e) => handleChange('primaryColor', e.target.value)}
            className="w-full p-1 border border-gray-300 rounded h-10"
          />
        </div>
      </div>
    </div>
  );
};