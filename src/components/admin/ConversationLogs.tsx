import React, { useState } from 'react';
import { Download, Search, Trash2, Calendar } from 'lucide-react';

interface Conversation {
  id: string;
  timestamp: string;
  messages: Array<{
    text: string;
    isAI: boolean;
    timestamp: string;
  }>;
}

interface ConversationLogsProps {
  config: any;
  setConfig: (config: any) => void;
}

export const ConversationLogs: React.FC<ConversationLogsProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Get conversations from localStorage
  const conversations: Conversation[] = JSON.parse(localStorage.getItem('aiCoachConversations') || '[]');

  // Filter conversations based on search term and date
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = searchTerm === '' || 
      conv.messages.some(msg => 
        msg.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesDate = selectedDate === '' || 
      conv.timestamp.startsWith(selectedDate);

    return matchesSearch && matchesDate;
  });

  const downloadConversations = () => {
    const data = JSON.stringify(filteredConversations, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversations-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearConversations = () => {
    if (window.confirm('Are you sure you want to clear all conversation logs? This cannot be undone.')) {
      localStorage.setItem('aiCoachConversations', '[]');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Conversation Logs</h3>
        <p className="mt-1 text-sm text-gray-500">
          View and manage conversation history between the AI coach and users.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={downloadConversations}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button
            onClick={clearConversations}
            className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredConversations.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No conversations found</p>
        ) : (
          filteredConversations.map((conv) => (
            <div key={conv.id} className="bg-white shadow rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">
                  {new Date(conv.timestamp).toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">
                  {conv.messages.length} messages
                </span>
              </div>
              <div className="space-y-3">
                {conv.messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.isAI ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.isAI
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <span className="text-xs opacity-75 mt-1 block">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};