import { Note } from '../types/notes';

const formatDate = (date: Date): string => {
  return date.toLocaleString();
};

export const exportNotesToText = (notes: Note[]): void => {
  const notesText = notes.map(note => {
    const tags = note.tags.length > 0 
      ? `\nTags: ${note.tags.join(', ')}`
      : '';
    
    return `Note (${formatDate(note.timestamp)}):\n${note.content}${tags}\n\n`;
  }).join('---\n\n');

  const header = `My Course Notes\nExported on: ${formatDate(new Date())}\n\n`;
  const content = header + notesText;
  
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `course-notes-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};