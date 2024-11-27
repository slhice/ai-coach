import React, { useState, useRef, useEffect } from 'react';
import { AdminSettings } from '../../../types/admin';
import { Plus, X, Upload, FileText, Loader2, AlertCircle } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

interface KnowledgeSourceTabProps {
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

export const KnowledgeSourceTab: React.FC<KnowledgeSourceTabProps> = ({
  settings,
  onUpdate,
}) => {
  const [newSource, setNewSource] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Initialize pdfjsLib
  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }, []);

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch (error) {
      return false;
    }
  };

  const handleAddSource = () => {
    if (newSource.trim()) {
      setUrlError('');
      
      if (newSource.startsWith('http')) {
        if (!validateUrl(newSource)) {
          setUrlError('Invalid URL format');
          return;
        }
        
        // Test URL accessibility
        fetch(newSource)
          .then(response => {
            if (!response.ok) throw new Error('URL not accessible');
            onUpdate({
              ...settings,
              knowledgeSource: {
                ...settings.knowledgeSource,
                sources: [...settings.knowledgeSource.sources, newSource.trim()],
              },
            });
            setNewSource('');
          })
          .catch(() => {
            setUrlError('URL is not accessible or readable');
          });
      } else {
        onUpdate({
          ...settings,
          knowledgeSource: {
            ...settings.knowledgeSource,
            sources: [...settings.knowledgeSource.sources, newSource.trim()],
          },
        });
        setNewSource('');
      }
    }
  };

  const handleRemoveSource = (index: number) => {
    const newSources = [...settings.knowledgeSource.sources];
    newSources.splice(index, 1);
    onUpdate({
      ...settings,
      knowledgeSource: {
        ...settings.knowledgeSource,
        sources: newSources,
      },
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFiles = async (files: FileList) => {
    setIsProcessing(true);
    
    for (const file of Array.from(files)) {
      try {
        const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const newFile: UploadedFile = {
          id: fileId,
          name: file.name,
          type: file.type,
          size: formatFileSize(file.size),
        };

        // Add file to uploaded files list
        setUploadedFiles(prev => [...prev, newFile]);
        
        // Add file to knowledge sources
        onUpdate({
          ...settings,
          knowledgeSource: {
            ...settings.knowledgeSource,
            sources: [...settings.knowledgeSource.sources, `[File] ${file.name}`],
          },
        });

        // Process file content
        const content = await readFile(file);
        if (content) {
          // Store file content if needed
          setUploadedFiles(prev => 
            prev.map(f => f.id === fileId ? { ...f, content } : f)
          );
        }
      } catch (error) {
        console.error('Error processing file:', error);
      }
    }
    
    setIsProcessing(false);
  };

  const readFile = async (file: File): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          if (file.type === 'application/pdf') {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';
            
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const pageText = textContent.items.map((item: any) => item.str).join(' ');
              fullText += pageText + '\n';
            }
            
            resolve(fullText);
          } else {
            resolve(e.target?.result as string);
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(reader.error);
      
      if (file.type === 'application/pdf') {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('border-blue-500');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-blue-500');
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-blue-500');
    }
    
    const { files } = e.dataTransfer;
    if (files && files.length > 0) {
      await handleFiles(files);
    }
  };

  const removeFile = (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (file) {
      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
      const sourceIndex = settings.knowledgeSource.sources.findIndex(
        s => s === `[File] ${file.name}`
      );
      if (sourceIndex !== -1) {
        handleRemoveSource(sourceIndex);
      }
    }
  };

  const defaultInstructions = `Format responses with proper structure:
- Use bullet points for lists (start with "-" or "•")
- Use numbered lists for sequential steps
- Add line breaks between paragraphs
- Use headings for sections when appropriate
- Format code blocks with proper indentation
- Use emphasis for important points
- Create tables for structured data`;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Knowledge Source Settings</h3>
      <div className="space-y-6">
        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Upload Files</h4>
          <div className="space-y-4">
            <div
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 transition-colors duration-200"
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                multiple
                accept=".txt,.md,.csv,.json,.pdf"
                className="hidden"
              />
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto disabled:bg-blue-400"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    {isProcessing ? 'Processing...' : 'Upload Files'}
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    or drag and drop files here
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: TXT, MD, CSV, JSON, PDF
                </p>
              </div>
            </div>

            {/* Display uploaded files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files</h5>
                <div className="space-y-2">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-gray-400" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-gray-500">({file.size})</span>
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Add External Source
          </label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newSource}
                onChange={(e) => {
                  setNewSource(e.target.value);
                  setUrlError('');
                }}
                className={`flex-1 p-2 border ${
                  urlError ? 'border-red-300' : 'border-gray-300'
                } rounded`}
                placeholder="Enter URL or reference"
              />
              <button
                onClick={handleAddSource}
                disabled={isProcessing}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1 disabled:bg-blue-400"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus size={16} />
                )}
                Add
              </button>
            </div>
            {urlError && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle size={16} />
                {urlError}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Knowledge Sources
          </label>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {settings.knowledgeSource.sources.map((source, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group"
              >
                <span className="text-sm pr-4 flex-1 break-all">
                  {source}
                </span>
                <button
                  onClick={() => handleRemoveSource(index)}
                  className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            {settings.knowledgeSource.sources.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No knowledge sources added yet
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Processing Instructions
          </label>
          <textarea
            value={settings.knowledgeSource.customInstructions || defaultInstructions}
            onChange={(e) => onUpdate({
              ...settings,
              knowledgeSource: {
                ...settings.knowledgeSource,
                customInstructions: e.target.value,
              },
            })}
            className="w-full p-2 border border-gray-300 rounded h-48 font-mono text-sm"
            placeholder="Enter instructions for processing knowledge sources..."
          />
          <p className="mt-2 text-sm text-gray-500">
            These instructions help format the AI's responses. You can customize the formatting rules to match your needs.
          </p>
        </div>
      </div>
    </div>
  );
};