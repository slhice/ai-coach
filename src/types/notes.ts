export interface Note {
  id: string;
  content: string;
  tags: string[];
  timestamp: Date;
}

export type SortOrder = 'newest' | 'oldest' | 'alphabetical';