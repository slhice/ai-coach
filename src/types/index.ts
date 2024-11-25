export interface Message {
  text: string;
  isAI: boolean;
}

export interface Note {
  id: string;
  content: string;
  timestamp: string;
  tags: string[];
}