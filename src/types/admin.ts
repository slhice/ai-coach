export interface AdminSettings {
  apiKey: string;
  chatbotSettings: {
    name: string;
    initialGreeting: string;
    responseDelay: number;
    focus?: string;
    description?: string;
    enableNotes?: boolean;
    enableVoiceChat?: boolean;
    voiceChatEmbed?: string;
  };
  format: {
    fontFamily: string;
    fontSize: string;
    primaryColor: string;
    chatbotIcon?: string;
  };
  responseStyle: {
    tone: 'professional' | 'casual' | 'friendly';
    length: 'concise' | 'detailed';
    language: string;
    basePrompt: string;
    instructions: string[];
  };
  knowledgeSource: {
    sources: string[];
    customInstructions: string;
  };
  conversations: {
    maxHistory: number;
    saveHistory: boolean;
    exportEnabled: boolean;
  };
  security: {
    password: string;
    maxAttempts: number;
    lockoutDuration: number;
    failedAttempts: number;
    lastFailedAttempt?: Date;
  };
}

export type AdminTab = 'apiKey' | 'chatbotSettings' | 'format' | 'responseStyle' | 'knowledgeSource' | 'conversations' | 'security';