import { Conversation, ConversationFilters } from '../types/conversation';

const STORAGE_KEY = 'chat_conversations';

export const conversationService = {
  getConversations: (): Conversation[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    try {
      const conversations = JSON.parse(stored);
      return conversations.map((conv: any) => ({
        ...conv,
        timestamp: new Date(conv.timestamp),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
    } catch (error) {
      console.error('Error loading conversations:', error);
      return [];
    }
  },

  saveConversations: (conversations: Conversation[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (error) {
      console.error('Error saving conversations:', error);
    }
  },

  filterConversations: (conversations: Conversation[], filters: ConversationFilters): Conversation[] => {
    return conversations.filter(conv => {
      // Search filter
      const searchMatch = !filters.search || 
        conv.messages.some(msg => 
          msg.text.toLowerCase().includes(filters.search.toLowerCase())
        );

      // Date range filter
      const dateMatch = (!filters.dateFrom || conv.timestamp >= filters.dateFrom) &&
        (!filters.dateTo || conv.timestamp <= filters.dateTo);

      return searchMatch && dateMatch;
    });
  },

  exportConversations: (conversations: Conversation[]): void => {
    const formatDate = (date: Date) => date.toLocaleString();
    
    const content = conversations.map(conv => {
      const header = `Conversation ID: ${conv.id}\nDate: ${formatDate(conv.timestamp)}\n\n`;
      const messages = conv.messages.map(msg => 
        `[${formatDate(msg.timestamp)}] ${msg.isBot ? 'Bot' : 'User'}: ${msg.text}`
      ).join('\n');
      return `${header}${messages}\n\n${'-'.repeat(50)}\n\n`;
    }).join('');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `conversations-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};