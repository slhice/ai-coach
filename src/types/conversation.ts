export interface Conversation {
  id: string;
  timestamp: Date;
  messages: {
    text: string;
    isBot: boolean;
    timestamp: Date;
  }[];
  tags?: string[];
}

export interface ConversationFilters {
  search: string;
  dateFrom?: Date;
  dateTo?: Date;
}