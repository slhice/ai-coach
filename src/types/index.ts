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