export interface Message {
  text: string;
  isAI: boolean;
  timestamp: string;
}

export interface Note {
  id: string;
  content: string;
  timestamp: string;
  tags: string[];
}

export interface Material {
  title: string;
  content: string;
  topics: string[];
  moduleNumber?: number;
}

export interface TutorConfig {
  id: string;
  subject: string;
  title: string;
  description: string;
  organization?: string;
  synthflowWidgetId: string;
  materials: Material[];
  instructions?: string;
  customPrompt?: string;
}