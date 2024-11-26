import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
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
        if (source.content instanceof File) {
          const loader = new PDFLoader(source.content);
          documents = await loader.load();
        }
        break;
        
      case 'text':
        if (typeof source.content === 'string') {
          const loader = new TextLoader(source.content);
          documents = await loader.load();
        }
        break;
        
      case 'url':
        if (source.content instanceof URL) {
          const loader = new CheerioWebBaseLoader(source.content.toString());
          documents = await loader.load();
        }
        break;

      case 'youtube':
        if (typeof source.content === 'string') {
          // Process YouTube transcript
          const transcript = await fetchYouTubeTranscript(source.content);
          documents = [{
            pageContent: transcript,
            metadata: { source: `youtube:${source.content}` }
          }];
        }
        break;
    }

    if (!documents) {
      throw new Error('No content loaded');
    }

    // Split documents into chunks for better processing
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const splitDocs = await textSplitter.splitDocuments(documents);

    // Add metadata
    if (source.metadata) {
      splitDocs.forEach(doc => {
        doc.metadata = { ...doc.metadata, ...source.metadata };
      });
    }

    // Store in secure storage
    secureStorage.saveKnowledgeSource({
      ...source,
      documents: splitDocs,
      timestamp: new Date().toISOString()
    });

    return splitDocs;
  } catch (error) {
    console.error('Error processing knowledge source:', error);
    throw error;
  }
}

export const createFineTunedModel = async (projectId: string, sources: KnowledgeSource[]) => {
  try {
    // Initialize fine-tuning config
    const config: FineTuneConfig = {
      projectId,
      status: 'pending',
      lastUpdated: new Date().toISOString()
    };

    secureStorage.setItem(`fineTune_${projectId}`, config);

    // Start fine-tuning process
    const response = await fetch('https://api.openai.com/v1/fine-tunes', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        training_file: await prepareTrainingData(sources),
        model: 'gpt-3.5-turbo',
        suffix: projectId
      })
    });

    const data = await response.json();

    // Update config with model ID
    config.modelId = data.id;
    config.status = 'training';
    secureStorage.setItem(`fineTune_${projectId}`, config);

    return config;
  } catch (error) {
    console.error('Error creating fine-tuned model:', error);
    throw error;
  }
}

export const getFineTuneStatus = async (projectId: string) => {
  const config = secureStorage.getItem(`fineTune_${projectId}`);
  if (!config?.modelId) return null;

  try {
    const response = await fetch(`https://api.openai.com/v1/fine-tunes/${config.modelId}`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      }
    });

    const data = await response.json();
    
    // Update status
    config.status = data.status;
    config.lastUpdated = new Date().toISOString();
    secureStorage.setItem(`fineTune_${projectId}`, config);

    return config;
  } catch (error) {
    console.error('Error checking fine-tune status:', error);
    return config;
  }
}

const prepareTrainingData = async (sources: KnowledgeSource[]) => {
  // Prepare and format training data for fine-tuning
  const trainingData = sources.flatMap(source => {
    // Convert documents to training format
    return source.documents.map(doc => ({
      messages: [
        { role: 'system', content: 'You are an AI tutor specialized in this subject.' },
        { role: 'user', content: 'Tell me about ' + doc.metadata.title },
        { role: 'assistant', content: doc.pageContent }
      ]
    }));
  });

  // Upload training data file
  const response = await fetch('https://api.openai.com/v1/files', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      file: new Blob([JSON.stringify(trainingData)], { type: 'application/json' }),
      purpose: 'fine-tune'
    })
  });

  const data = await response.json();
  return data.id;
}

const fetchYouTubeTranscript = async (videoId: string) => {
  // Implementation for fetching YouTube transcript
  // Using youtube-transcript package
  const { YoutubeTranscript } = await import('youtube-transcript');
  const transcript = await YoutubeTranscript.fetchTranscript(videoId);
  return transcript.map(t => t.text).join(' ');
};