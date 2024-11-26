import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Link, Trash2, AlertCircle } from 'lucide-react';
import { KnowledgeSource } from '../../lib/knowledgeBase';
import { secureStorage } from '../../lib/secureStorage';

interface KnowledgeSourcesPanelProps {
  config: any;
  setConfig: (config: any) => void;
}

export const KnowledgeSourcesPanel: React.FC<KnowledgeSourcesPanelProps> = ({ config, setConfig }) => {
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md']
    },
    onDrop: (acceptedFiles) => {
      const newSources = acceptedFiles.map(file => ({
        type: 'pdf' as const,
        content: file,
        metadata: {
          title: file.name,
          date: new Date().toISOString()
        }
      }));

      setConfig(prev => ({
        ...prev,
        knowledge: {
          ...prev.knowledge,
          sources: [...(prev.knowledge?.sources || []), ...newSources]
        }
      }));
    }
  });

  const addUrlSource = () => {
    try {
      new URL(url);
      setUrlError('');
      
      const newSource: KnowledgeSource = {
        type: 'url' as const,
        content: new URL(url),
        metadata: {
          title: url,
          date: new Date().toISOString()
        }
      };

      setConfig(prev => ({
        ...prev,
        knowledge: {
          ...prev.knowledge,
          sources: [...(prev.knowledge?.sources || []), newSource]
        }
      }));
      
      setUrl('');
    } catch {
      setUrlError('Please enter a valid URL');
    }
  };

  const addYouTubeSource = (videoId: string) => {
    const newSource: KnowledgeSource = {
      type: 'youtube' as const,
      content: videoId,
      metadata: {
        title: `YouTube Video: ${videoId}`,
        date: new Date().toISOString()
      }
    };

    setConfig(prev => ({
      ...prev,
      knowledge: {
        ...prev.knowledge,
        sources: [...(prev.knowledge?.sources || []), newSource]
      }
    }));
  };

  const removeSource = (index: number) => {
    setConfig(prev => ({
      ...prev,
      knowledge: {
        ...prev.knowledge,
        sources: prev.knowledge.sources.filter((_: any, i: number) => i !== index)
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Knowledge Sources</h3>
        <p className="mt-1 text-sm text-gray-500">
          Add documents and URLs to build your AI coach's knowledge base.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Upload Files</h4>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 cursor-pointer"
          >
            <input {...getInputProps()} />
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Drag and drop files here, or click to select files
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Supported formats: PDF, TXT, MD
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Add URL</h4>
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/document"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              onClick={addUrlSource}
              disabled={!url}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add URL
            </button>
          </div>
          {urlError && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {urlError}
            </p>
          )}
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Current Sources</h4>
          {(!config.knowledge?.sources || config.knowledge.sources.length === 0) ? (
            <p className="text-sm text-gray-500 italic">No sources added yet</p>
          ) : (
            <ul className="space-y-2">
              {config.knowledge.sources.map((source: KnowledgeSource, index: number) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    {source.type === 'url' ? (
                      <Link className="h-5 w-5 text-gray-400 mr-2" />
                    ) : (
                      <Upload className="h-5 w-5 text-gray-400 mr-2" />
                    )}
                    <span className="text-sm text-gray-700">
                      {source.metadata?.title || 'Untitled Source'}
                    </span>
                  </div>
                  <button
                    onClick={() => removeSource(index)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};