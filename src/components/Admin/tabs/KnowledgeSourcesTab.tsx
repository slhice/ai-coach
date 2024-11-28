import React, { useState, useRef, DragEvent } from 'react';
import { AdminSettings } from '../../../types/admin';
import { Plus, X, Upload, FileText, Loader2, AlertCircle } from 'lucide-react';

interface KnowledgeSourcesTabProps {
  settings: AdminSettings;
  onUpdate: (settings: AdminSettings) => void;
}

export const KnowledgeSourcesTab: React.FC<KnowledgeSourcesTabProps> = ({
  settings,
  onUpdate,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileTypeLabel = (mimeType: string): string => {
    switch (mimeType) {
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/msword':
        return 'Word';
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      case 'application/vnd.ms-excel':
        return 'Excel';
      case 'text/plain':
        return 'Text';
      default:
        return 'Document';
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setIsProcessing(true);
    setError('');

    try {
      for (const file of Array.from(files)) {
        // Check file type
        const validTypes = [
          'text/plain',                                                    // .txt
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
          'application/msword',                                           // .doc
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',      // .xlsx
          'application/vnd.ms-excel'                                      // .xls
        ];

        if (!validTypes.includes(file.type)) {
          throw new Error(`Unsupported file type: ${file.type}`);
        }

        let content = '';
        if (file.type === 'text/plain') {
          content = await file.text();
        }

        // Format the display name
        const fileType = getFileTypeLabel(file.type);
        const fileName = file.name.replace(/\.[^/.]+$/, ''); // Remove file extension
        const displayName = `[${fileType}] ${fileName}`;

        // Add the processed content to sources
        const updatedSources = [...settings.knowledgeSource.sources];
        updatedSources.push(`${displayName} (${formatFileSize(file.size)})`);
        
        onUpdate({
          ...settings,
          knowledgeSource: {
            ...settings.knowledgeSource,
            sources: updatedSources
          }
        });
      }
    } catch (err) {
      console.error('Error processing file:', err);
      setError(`Error processing file: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const [newSource, setNewSource] = useState('');

  const handleAddSource = () => {
    if (newSource.trim()) {
      onUpdate({
        ...settings,
        knowledgeSource: {
          ...settings.knowledgeSource,
          sources: [...settings.knowledgeSource.sources, newSource.trim()]
        }
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
        sources: newSources
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Knowledge Sources</h3>
        
        {/* File Upload */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                multiple
                accept=".txt,.doc,.docx,.xls,.xlsx"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-700"
              >
                Click to upload
              </button>
              <span className="text-gray-500"> or drag and drop</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Text, Word, or Excel files up to 10MB
            </p>
          </div>
        </div>

        {isProcessing && (
          <div className="mt-2 flex items-center gap-2 text-blue-600">
            <Loader2 className="animate-spin" size={16} />
            <span>Processing file...</span>
          </div>
        )}

        {error && (
          <div className="mt-2 flex items-center gap-2 text-red-600">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* External Source Input */}
        <div className="mt-6">
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
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Added Sources */}
        <div className="mt-4 space-y-2">
          {settings.knowledgeSource.sources.map((source, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <FileText size={16} className="text-gray-400" />
              <span className="flex-1 text-sm truncate">{source}</span>
              <button
                onClick={() => handleRemoveSource(index)}
                className="p-1 text-gray-400 hover:text-red-500"
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
            value={settings.knowledgeSource.knowledgeSourceFlexibility}
            onChange={(e) => onUpdate({
              ...settings,
              knowledgeSource: {
                ...settings.knowledgeSource,
                knowledgeSourceFlexibility: e.target.value
              }
            })}
            className="w-full p-2 border border-gray-300 rounded h-48 font-mono text-sm"
            placeholder="Define how the AI should handle information from knowledge sources and related topics."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Formatting Instructions
          </label>
          <textarea
            value={settings.knowledgeSource.formattingInstructions}
            onChange={(e) => onUpdate({
              ...settings,
              knowledgeSource: {
                ...settings.knowledgeSource,
                formattingInstructions: e.target.value
              }
            })}
            className="w-full p-2 border border-gray-300 rounded h-48 font-mono text-sm"
            placeholder="Specify how responses should be formatted, including lists, paragraphs, and special formatting."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Guidelines
          </label>
          <textarea
            value={settings.knowledgeSource.guidelines}
            onChange={(e) => onUpdate({
              ...settings,
              knowledgeSource: {
                ...settings.knowledgeSource,
                guidelines: e.target.value
              }
            })}
            className="w-full p-2 border border-gray-300 rounded h-48 font-mono text-sm"
            placeholder="Define general rules for how the AI should handle responses and knowledge source usage."
          />
        </div>
      </div>
    </div>
  );
};