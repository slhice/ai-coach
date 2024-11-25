import React, { useState } from 'react';
import { GraduationCap, Trash2 } from 'lucide-react';

interface StyleConfigProps {
  config: any;
  setConfig: (config: any) => void;
}

export const StyleConfig: React.FC<StyleConfigProps> = ({ config, setConfig }) => {
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  const handleColorChange = (color: string) => {
    setConfig({
      ...config,
      style: {
        ...config.style,
        primaryColor: color
      }
    });
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig({
          ...config,
          style: {
            ...config.style,
            icon: reader.result as string
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeIcon = () => {
    setConfig({
      ...config,
      style: {
        ...config.style,
        icon: null
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Style & Branding</h3>
        <p className="mt-1 text-sm text-gray-500">
          Customize the appearance of your AI coach application.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Primary Color
        </label>
        <div className="flex items-center space-x-2">
          <div
            className="w-10 h-10 rounded-lg shadow-inner cursor-pointer"
            style={{ backgroundColor: config.style?.primaryColor || '#3B82F6' }}
            onClick={() => setColorPickerOpen(!colorPickerOpen)}
          />
          <input
            type="text"
            value={config.style?.primaryColor || '#3B82F6'}
            onChange={(e) => handleColorChange(e.target.value)}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="#3B82F6"
          />
        </div>
        {colorPickerOpen && (
          <div className="absolute mt-2 bg-white rounded-lg shadow-lg p-4 z-10">
            <input
              type="color"
              value={config.style?.primaryColor || '#3B82F6'}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-full h-40"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Application Icon
        </label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleIconUpload}
            />
            {config.style?.icon ? (
              <img
                src={config.style.icon}
                alt="App icon"
                className="w-full h-full object-contain"
              />
            ) : (
              <GraduationCap className="w-8 h-8 text-gray-400" />
            )}
          </label>
          {config.style?.icon && (
            <button
              onClick={removeIcon}
              className="p-2 text-red-600 hover:text-red-700"
              title="Remove icon"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Upload a square image (recommended size: 512x512px)
        </p>
      </div>

      <div className="rounded-md bg-blue-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Style Preview</h3>
            <div className="mt-4">
              <div className="flex items-center space-x-4">
                <div className="w-24 h-12 rounded-lg" style={{ backgroundColor: config.style?.primaryColor || '#3B82F6' }} />
                <div className="text-sm">
                  <p className="font-medium">Primary Color</p>
                  <p className="text-gray-500">{config.style?.primaryColor || '#3B82F6'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};