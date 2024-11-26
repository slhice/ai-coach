import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PenLine, Save, Download, Trash2, Tag, Plus, X } from 'lucide-react';
import { Message, Note } from '../types';
import { secureStorage } from '../lib/secureStorage';

interface NotesPanelProps {
  messages: Message[];
}

export const NotesPanel: React.FC<NotesPanelProps> = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    return secureStorage.getItem('notes') || [];
  });
  const [currentNote, setCurrentNote] = useState('');
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showTagInput, setShowTagInput] = useState(false);

  useEffect(() => {
    secureStorage.setItem('notes', notes);
  }, [notes]);

  const getAllTags = () => {
    const tagSet = new Set<string>();
    notes.forEach(note => note.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet);
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !currentTags.includes(tag.trim())) {
      setCurrentTags([...currentTags, tag.trim()]);
    }
    setNewTag('');
    setShowTagInput(false);
  };

  const removeTag = (tagToRemove: string) => {
    setCurrentTags(currentTags.filter(tag => tag !== tagToRemove));
  };

  const saveNote = () => {
    if (currentNote.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        content: currentNote,
        timestamp: new Date().toISOString(),
        tags: currentTags,
      };
      setNotes(prev => [newNote, ...prev]);
      setCurrentNote('');
      setCurrentTags([]);
    }
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const downloadNotes = () => {
    const filteredNotes = selectedTag
      ? notes.filter(note => note.tags.includes(selectedTag))
      : notes;

    const notesText = filteredNotes
      .map(note => {
        const tags = note.tags.length ? `[Tags: ${note.tags.join(', ')}]` : '';
        return `[${note.timestamp}] ${tags}\n${note.content}\n\n`;
      })
      .join('---\n\n');

    const blob = new Blob([notesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-coach-notes${selectedTag ? `-${selectedTag}` : ''}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredNotes = selectedTag
    ? notes.filter(note => note.tags.includes(selectedTag))
    : notes;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <PenLine className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Study Notes</h2>
        </div>
        <div className="flex items-center space-x-2">
          {notes.length > 0 && (
            <button
              onClick={downloadNotes}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              title={`Download ${selectedTag ? selectedTag + ' ' : ''}notes`}
            >
              <Download className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-3 py-1 rounded-full text-sm ${
            !selectedTag
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {getAllTags().map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedTag === tag
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {filteredNotes.map((note) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 rounded-lg p-3 relative group"
          >
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-600">{new Date(note.timestamp).toLocaleString()}</p>
              <button
                onClick={() => deleteNote(note.id)}
                className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {note.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.content}</p>
          </motion.div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Tag className="w-4 h-4 text-gray-500" />
          {currentTags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center gap-1"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {showTagInput ? (
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addTag(newTag);
                } else if (e.key === 'Escape') {
                  setShowTagInput(false);
                  setNewTag('');
                }
              }}
              placeholder="Add tag..."
              className="text-sm border-none focus:ring-0 p-0 w-20"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setShowTagInput(true)}
              className="text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

        <textarea
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          placeholder="Take notes here..."
          className="w-full h-24 p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={saveNote}
            disabled={!currentNote.trim()}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Note</span>
          </button>
        </div>
      </div>
    </div>
  );
};