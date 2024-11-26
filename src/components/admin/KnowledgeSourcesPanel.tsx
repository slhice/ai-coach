import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Link as LinkIcon, Trash2, Youtube, AlertCircle, Loader } from 'lucide-react';
import { processKnowledgeSource } from '../../lib/knowledgeBase';

interface KnowledgeSourcesPanelProps {
  config: any;
  setConfig: (config: any) => void;
}

export const KnowledgeSourcesPanel: React.FC<KnowledgeSourcesPanelProps> = ({ config, setConfig }) => {
  const [url, setUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsProcessing(true);
    setError('');

    try {
      for (const file of acceptedFiles) {
        const source = {
          type: file.type.includes('pdf') ? 'pdf' : 'text',
          content: file,
          metadata: {
            title: file.name,
            date: new Date().toISOString()
          }
        };

        const processedDocs = await processKnowledgeSource(source);
        
        setConfig(prev => ({
          ...prev,
          knowledge: {
            ...prev.knowledge,
            sources: [...(prev.knowledge?.sources || []), {
              type: source.type,
              name: file.name,
              content: processedDocs,
              timestamp: new Date().toISOString()
            }]
          }
        }));
      }
    } catch (err) {
      setError('Error processing files. Please try again.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  }, [setConfig]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md']
    },
    disabled: isProcessing
  });

  const addUrlSource = async () => {
    if (!url) return;
    setIsProcessing(true);
    setError('');

    try {
      const source = {
        type: 'url',
        content: new URL(url),
        metadata: {
          title: url,
          date: new Date().toISOString()
        }
      };

      const processedDocs = await processKnowledgeSource(source);
      
      setConfig(prev => ({
        ...prev,
        knowledge: {
          ...prev.knowledge,
          sources: [...(prev.knowledge?.sources || []), {
            type: 'url',
            name: url,
            content: processedDocs,
            timestamp: new Date().toISOString()
          }]
        }
      }));

      setUrl('');
    } catch (err) {
      setError('Invalid URL or unable to process content.');
    } finally {
      setIsProcessing(false);
    }
  };

  const addYoutubeSource = async () => {
    if (!youtubeUrl) return;
    setIsProcessing(true);
    setError('');

    try {
      const videoId = new URL(youtubeUrl).searchParams.get('v');
      if (!videoId) throw new Error('Invalid YouTube URL');

      const source = {
        type: 'youtube',
        content: videoId,
        metadata: {
          title: youtubeUrl,
          date: new Date().toISOString()
        }
      };

      const processedDocs = await processKnowledgeSource(source);
      
      setConfig(prev => ({
        ...prev,
        knowledge: {
          ...prev.knowledge,
          sources: [...(prev.knowledge?.sources || []), {
            type: 'youtube',
            name: youtubeUrl,
            content: processedDocs,
            timestamp: new Date().toISOString()
          }]
        }
      }));

      setYoutubeUrl('');
    } catch (err) {
      setError('Invalid YouTube URL or unable to process video transcript.');
    } finally {
      setIsProcessing(false);
    }
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
          Add documents, URLs, and videos to build your AI coach's knowledge base.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Upload Files</h4>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 cursor-pointer ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
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
              disabled={isProcessing}
            />
            <button
              onClick={addUrlSource}
              disabled={!url || isProcessing}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add URL
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Add YouTube Video</h4>
          <div className="flex gap-2">
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={isProcessing}
            />
            <button
              onClick={addYoutubeSource}
              disabled={!youtubeUrl || isProcessing}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Video
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <Loader className="h-5 w-5 text-blue-400 animate-spin" />
              <div className="ml-3">
                <p className="text-sm text-blue-700">Processing source...</p>
              </div>
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Current Sources</h4>
          {(!config.knowledge?.sources || config.knowledge.sources.length === 0) ? (
            <p className="text-sm text-gray-500 italic">No sources added yet</p>
          ) : (
            <ul className="space-y-2">
              {config.knowledge.sources.map((source: any, index: number) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    {source.type === 'url' && <LinkIcon className="h-5 w-5 text-gray-400 mr-2" />}
                    {source.type === 'youtube' && <Youtube className="h-5 w-5 text-gray-400 mr-2" />}
                    {(source.type === 'pdf' || source.type === 'text') && (
                      <Upload className="h-5 w-5 text-gray-400 mr-2" />
                    )}
                    <span className="text-sm text-gray-700">{source.name}</span>
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