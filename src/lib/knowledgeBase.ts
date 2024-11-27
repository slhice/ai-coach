export type KnowledgeSourceType = 'text' | 'url' | 'pdf' | 'youtube';

export interface KnowledgeSource {
  type: KnowledgeSourceType;
  content: string | File | URL;
  metadata?: {
    title?: string;
    author?: string;
    date?: string;
    topic?: string[];
  };
}

export interface ProcessedKnowledgeSource {
  content: string;
  metadata: {
    title: string;
    type: KnowledgeSourceType;
    date: string;
  };
}

export const processKnowledgeSource = async (source: KnowledgeSource): Promise<ProcessedKnowledgeSource> => {
  try {
    let content = '';
    
    switch (source.type) {
      case 'text':
        content = source.content as string;
        break;
        
      case 'url':
        const url = source.content as URL;
        const response = await fetch(url.toString());
        content = await response.text();
        break;
        
      case 'pdf':
        content = 'PDF content';
        break;

      case 'youtube':
        content = 'YouTube transcript';
        break;
    }

    return {
      content,
      metadata: {
        title: source.metadata?.title || 'Untitled',
        type: source.type,
        date: source.metadata?.date || new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error processing knowledge source:', error);
    throw error;
  }
};