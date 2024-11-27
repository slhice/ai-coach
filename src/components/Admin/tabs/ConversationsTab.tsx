import React, { useState, useEffect } from 'react';
import { AdminSettings } from '../../../types/admin';
import { Conversation, ConversationFilters } from '../../../types/conversation';
import { conversationService } from '../../../services/conversationService';
import { Search, Calendar, Download, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

interface ConversationsTabProps {
  settings: AdminSettings;
  onUpdate: (settings: AdminSettings) => void;
}

export const ConversationsTab: React.FC<ConversationsTabProps> = ({
  settings,
  onUpdate,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filters, setFilters] = useState<ConversationFilters>({ search: '' });
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [selectedConversations, setSelectedConversations] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadedConversations = conversationService.getConversations();
    setConversations(loadedConversations);
  }, []);

  const filteredConversations = conversationService.filterConversations(conversations, filters);

  const handleExportSelected = () => {
    const selectedConvs = conversations.filter(conv => 
      selectedConversations.has(conv.id)
    );
    conversationService.exportConversations(selectedConvs);
  };

  const handleDeleteSelected = () => {
    const updatedConversations = conversations.filter(
      conv => !selectedConversations.has(conv.id)
    );
    setConversations(updatedConversations);
    conversationService.saveConversations(updatedConversations);
    setSelectedConversations(new Set());
    setSelectedConversation(null);
  };

  const toggleSelectAll = () => {
    if (selectedConversations.size === filteredConversations.length) {
      setSelectedConversations(new Set());
    } else {
      setSelectedConversations(
        new Set(filteredConversations.map(conv => conv.id))
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Conversation History</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportSelected}
            disabled={selectedConversations.size === 0}
            className={`px-3 py-1.5 rounded flex items-center gap-1 ${
              selectedConversations.size > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Download size={16} />
            Export Selected
          </button>
          <button
            onClick={handleDeleteSelected}
            disabled={selectedConversations.size === 0}
            className={`px-3 py-1.5 rounded flex items-center gap-1 ${
              selectedConversations.size > 0
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Trash2 size={16} />
            Delete Selected
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search conversations..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex gap-2">
          <div>
            <input
              type="date"
              onChange={(e) => setFilters({
                ...filters,
                dateFrom: e.target.value ? new Date(e.target.value) : undefined
              })}
              className="px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <input
              type="date"
              onChange={(e) => setFilters({
                ...filters,
                dateTo: e.target.value ? new Date(e.target.value) : undefined
              })}
              className="px-3 py-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-3 border-b flex items-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedConversations.size === filteredConversations.length}
              onChange={toggleSelectAll}
              className="mr-3"
            />
            Select All
          </label>
        </div>
        <div className="divide-y">
          {filteredConversations.map((conv) => (
            <div key={conv.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedConversations.has(conv.id)}
                    onChange={() => {
                      const newSelected = new Set(selectedConversations);
                      if (newSelected.has(conv.id)) {
                        newSelected.delete(conv.id);
                      } else {
                        newSelected.add(conv.id);
                      }
                      setSelectedConversations(newSelected);
                    }}
                    className="mr-3"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {conv.timestamp.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {conv.messages.length} messages
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {conv.messages[0].text.substring(0, 100)}...
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedConversation(
                    selectedConversation === conv.id ? null : conv.id
                  )}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {selectedConversation === conv.id ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
              </div>
              {selectedConversation === conv.id && (
                <div className="mt-4 pl-8 space-y-3">
                  {conv.messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        msg.isBot ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.isBot
                            ? 'bg-gray-100'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <span className="text-xs opacity-75 mt-1 block">
                          {msg.timestamp.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};