import React, { useState, useRef } from 'react';
import { AdminSettings } from '../../../types/admin';
import { Plus, X, Upload, FileText, Loader2, AlertCircle } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

interface KnowledgeSourcesTabProps {
  settings: AdminSettings;
  onUpdate: (settings: AdminSettings) => void;
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: string;
  content?: string;
}

export const KnowledgeSourcesTab: React.FC<KnowledgeSourcesTabProps> = ({
  settings,
  onUpdate,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [newSource, setNewSource] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;

    setIsProcessing(true);
    setError('');

    for (const file of Array.from(files)) {
      try {
        const content = await readFileContent(file);
        const newFile: UploadedFile = {
          id: `file-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: file.type,
          size: formatFileSize(file.size),
          content,
        };

        setUploadedFiles(prev => [...prev, newFile]);
        
        // Update the knowledge sources with the file content
        const updatedSources = [...settings.knowledgeSource.sources];
        updatedSources.push(`[${file.name}] ${content}`);
        
        onUpdate({
          ...settings,
          knowledgeSource: {
            ...settings.knowledgeSource,
            sources: updatedSources,
          },
        });
      } catch (err) {
        console.error('Error processing file:', err);
        setError(`Error processing file ${file.name}`);
      }
    }

    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const readFileContent = async (file: File): Promise<string> => {
    if (file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let content = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        content += textContent.items.map((item: any) => item.str).join(' ') + '\n';
      }
      
      return content;
    } else {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleAddSource = () => {
    if (newSource.trim()) {
      onUpdate({
        ...settings,
        knowledgeSource: {
          ...settings.knowledgeSource,
          sources: [...settings.knowledgeSource.sources, newSource.trim()],
        },
      });
      setNewSource('');
    }
  };

  const handleRemoveSource = (index: number) => {
    const newSources = settings.knowledgeSource.sources.filter((_, i) => i !== index);
    onUpdate({
      ...settings,
      knowledgeSource: {
        ...settings.knowledgeSource,
        sources: newSources,
      },
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Knowledge Sources</h3>
      <div className="space-y-6">
        {/* File Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Files
          </label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileUpload(e.dataTransfer.files);
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              multiple
              accept=".txt,.pdf,.doc,.docx"
            />
            <div className="space-y-2">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="text-sm text-gray-600">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Click to upload
                </button>
                {' or drag and drop'}
              </div>
              <p className="text-xs text-gray-500">
                PDF, TXT, DOC, DOCX up to 10MB
              </p>
            </div>
          </div>
          {isProcessing && (
            <div className="mt-2 flex items-center gap-2 text-blue-600">
              <Loader2 className="animate-spin" size={16} />
              <span>Processing files...</span>
            </div>
          )}
          {error && (
            <div className="mt-2 flex items-center gap-2 text-red-600">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* External Source Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add External Source
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
              placeholder="Enter URL or paste content..."
              className="flex-1 p-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleAddSource}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </div>

        {/* Knowledge Sources List */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Added Sources</h4>
          <div className="space-y-2">
            {settings.knowledgeSource.sources.map((source, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg group"
              >
                <FileText className="flex-shrink-0 text-gray-400" size={20} />
                <p className="flex-1 text-sm text-gray-600 break-all">
                  {source.length > 100 ? `${source.substring(0, 100)}...` : source}
                </p>
                <button
                  onClick={() => handleRemoveSource(index)}
                  className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Processing Instructions */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Knowledge Source Flexibility
            </label>
            <textarea
              defaultValue={settings.knowledgeSource.knowledgeSourceFlexibility}
              onChange={(e) => onUpdate({
                ...settings,
                knowledgeSource: {
                  ...settings.knowledgeSource,
                  knowledgeSourceFlexibility: e.target.value,
                },
              })}
              className="w-full p-2 border border-gray-300 rounded h-48 font-mono text-sm"
            />
            <p className="mt-1 text-sm text-gray-500">
              Define how the AI should handle information from knowledge sources and related topics.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formatting Instructions
            </label>
            <textarea
              defaultValue={settings.knowledgeSource.formattingInstructions}
              onChange={(e) => onUpdate({
                ...settings,
                knowledgeSource: {
                  ...settings.knowledgeSource,
                  formattingInstructions: e.target.value,
                },
              })}
              className="w-full p-2 border border-gray-300 rounded h-48 font-mono text-sm"
            />
            <p className="mt-1 text-sm text-gray-500">
              Specify how responses should be formatted, including lists, paragraphs, and special formatting.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Guidelines
            </label>
            <textarea
              defaultValue={settings.knowledgeSource.guidelines}
              onChange={(e) => onUpdate({
                ...settings,
                knowledgeSource: {
                  ...settings.knowledgeSource,
                  guidelines: e.target.value,
                },
              })}
              className="w-full p-2 border border-gray-300 rounded h-48 font-mono text-sm"
            />
            <p className="mt-1 text-sm text-gray-500">
              Define general rules for how the AI should handle responses and knowledge source usage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};