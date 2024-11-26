import { secureStorage } from './secureStorage';

export interface KnowledgeSource {
  type: 'pdf' | 'text' | 'url' | 'youtube';
  content: string | File | URL;
  metadata?: {
    title?: string;
    author?: string;
    date?: string;
    topic?: string[];
    projectId?: string;
    modelId?: string;
  };
}

export interface FineTuneConfig {
  projectId: string;
  modelId?: string;
  status: 'pending' | 'training' | 'completed' | 'failed';
  lastUpdated: string;
}

export const processKnowledgeSource = async (source: KnowledgeSource) => {
  try {
    let documents;
    
    switch (source.type) {
      case 'pdf':
      case 'text':
      case 'url':
      case 'youtube':
        documents = [{
          pageContent: typeof source.content === 'string' ? source.content : 'File content',
          metadata: { ...source.metadata }
        }];
        break;
    }

    if (!documents) {
      throw new Error('No content loaded');
    }

    // Store in secure storage
    secureStorage.setItem(`source_${Date.now()}`, {
      ...source,
      documents,
      timestamp: new Date().toISOString()
    });

    return documents;
  } catch (error) {
    console.error('Error processing knowledge source:', error);
    throw error;
  }
};