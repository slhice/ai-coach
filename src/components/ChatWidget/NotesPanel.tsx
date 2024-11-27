import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Tag as TagIcon, Trash2, Download } from 'lucide-react';
import { Note, SortOrder } from '../../types/notes';
import { notesService } from '../../services/notesService';
import { exportNotesToText } from '../../utils/notesExport';

interface NotesPanelProps {
  onClose: () => void;
}

export const NotesPanel: React.FC<NotesPanelProps> = ({ onClose }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [newTags, setNewTags] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  // Load notes from storage on component mount
  useEffect(() => {
    const savedNotes = notesService.getNotes();
    setNotes(savedNotes);
  }, []);

  // Save notes whenever they change
  useEffect(() => {
    notesService.saveNotes(notes);
  }, [notes]);

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        content: newNote,
        tags: newTags.split(',').map(tag => tag.trim()).filter(tag => tag),
        timestamp: new Date(),
      };
      setNotes(prev => [...prev, note]);
      setNewNote('');
      setNewTags('');
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const handleDownloadNotes = () => {
    exportNotesToText(notes);
  };

  const getSortedNotes = () => {
    return [...notes].sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return b.timestamp.getTime() - a.timestamp.getTime();
        case 'oldest':
          return a.timestamp.getTime() - b.timestamp.getTime();
        case 'alphabetical':
          return a.content.localeCompare(b.content);
        default:
          return 0;
      }
    });
  };

  return (
    <div className="w-[300px] bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-semibold">Notes</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadNotes}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            title="Download Notes"
          >
            <Download size={20} />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a new note..."
          className="w-full p-2 border border-gray-300 rounded-lg resize-none h-24"
        />
        <div className="flex items-center mt-2 gap-2">
          <TagIcon size={16} className="text-gray-500" />
          <input
            type="text"
            value={newTags}
            onChange={(e) => setNewTags(e.target.value)}
            placeholder="Tags (comma-separated)"
            className="flex-1 p-1 text-sm border border-gray-300 rounded"
          />
        </div>
        <button
          onClick={handleAddNote}
          className="mt-2 w-full flex items-center justify-center gap-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle size={16} />
          Add Note
        </button>
      </div>

      <div className="p-4 border-b border-gray-200">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as SortOrder)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {getSortedNotes().map((note) => (
          <div key={note.id} className="p-3 bg-gray-50 rounded-lg relative group">
            <button
              onClick={() => handleDeleteNote(note.id)}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete note"
            >
              <Trash2 size={16} />
            </button>
            <p className="text-sm pr-8">{note.content}</p>
            {note.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <p className="mt-2 text-xs text-gray-500">
              {note.timestamp.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};