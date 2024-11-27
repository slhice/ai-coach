import { Note } from '../types/notes';

const STORAGE_KEY = 'chat_notes';

export const notesService = {
  getNotes: (): Note[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    try {
      // Parse stored notes and convert timestamp strings back to Date objects
      const notes = JSON.parse(stored);
      return notes.map((note: any) => ({
        ...note,
        timestamp: new Date(note.timestamp)
      }));
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  },

  saveNotes: (notes: Note[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  }
};