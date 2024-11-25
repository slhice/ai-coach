import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export interface KnowledgeSource {
  type: 'pdf' | 'text' | 'url';
  content: string | File | URL;
  metadata?: {
    title?: string;
    author?: string;
    date?: string;
    topic?: string[];
  };
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

    return splitDocs;
  } catch (error) {
    console.error('Error processing knowledge source:', error);
    throw error;
  }
}