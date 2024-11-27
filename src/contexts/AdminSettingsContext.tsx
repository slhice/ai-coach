import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminSettings } from '../types/admin';
import { adminService } from '../services/adminService';

const DEFAULT_SETTINGS: AdminSettings = {
  apiKey: '',
  chatbotSettings: {
    name: 'AI Coach',
    initialGreeting: 'Hi there! How can I help you today?',
    responseDelay: 1000,
  },
  format: {
    fontFamily: 'Inter',
    fontSize: '14px',
    primaryColor: '#2563eb',
    chatbotIcon: undefined,
  },
  responseStyle: {
    tone: 'professional',
    length: 'concise',
    language: 'English',
    basePrompt: 'You are an AI teaching assistant focused on helping students understand course material. Your responses should be educational, supportive, and aimed at fostering learning.',
    instructions: [],
  },
  knowledgeSource: {
    sources: [],
    knowledgeSourceFlexibility: `1. Primary Source Handling:
- Use provided knowledge sources as the primary reference
- Maintain accuracy when citing specific information
- Clearly indicate when information comes directly from sources

2. Related Topics:
- When a topic is mentioned in sources, you may:
  • Provide additional context and explanations
  • Draw logical connections to related concepts
  • Offer relevant examples
- Always indicate when you're extending beyond direct source content
- Keep extended information closely related to source material

3. Topic Boundaries:
- Stay within the general subject area of the sources
- Allow for reasonable elaboration when concepts are connected
- If a topic isn't covered in sources:
  • Acknowledge this fact
  • Suggest related topics that are covered
  • Offer to focus on available information

4. Confidence Levels:
- High: Direct quotes and specific information from sources
- Medium: Logical extensions and closely related concepts
- Low: General knowledge related to the topic
- Indicate confidence level when appropriate`,
    formattingInstructions: `1. Text Structure:
- Use clear paragraph breaks for new ideas
- Add line breaks between sections
- Maintain consistent indentation
- Use spacing to improve readability

2. Lists and Bullets:
- Use "-" or "•" for unordered lists
- Use numbers for sequential steps
- Indent sub-points under main points
- Add line breaks between list items

3. Emphasis and Formatting:
- Use bold for important terms
- Use italics for emphasis
- Create tables for comparing information
- Use code blocks for technical content

4. Visual Organization:
- Group related information
- Use headers for sections
- Create clear visual hierarchies
- Maintain consistent formatting throughout`,
    guidelines: `1. Response Framework:
- Start with direct source information
- Build upon established concepts
- Connect related ideas logically
- Maintain educational focus

2. Source Integration:
- Cite sources when appropriate
- Blend information naturally
- Maintain context accuracy
- Preserve original meaning

3. Educational Approach:
- Focus on understanding
- Provide clear explanations
- Use relevant examples
- Encourage critical thinking

4. Content Boundaries:
- Stay within source scope
- Acknowledge limitations
- Suggest alternatives
- Maintain transparency`,
  },
  conversations: {
    maxHistory: 50,
    saveHistory: true,
    exportEnabled: true,
  },
  security: {
    password: 'admin123',
    maxAttempts: 3,
    lockoutDuration: 30,
    failedAttempts: 0,
  },
};

const AdminSettingsContext = createContext<{
  settings: AdminSettings;
  updateSettings: (settings: AdminSettings) => void;
} | undefined>(undefined);

export const AdminSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AdminSettings>(() => {
    const savedSettings = adminService.getSettings();
    return savedSettings || DEFAULT_SETTINGS;
  });

  const updateSettings = (newSettings: AdminSettings) => {
    setSettings(newSettings);
    adminService.saveSettings(newSettings);
  };

  return (
    <AdminSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </AdminSettingsContext.Provider>
  );
};

export const useAdminSettings = () => {
  const context = useContext(AdminSettingsContext);
  if (context === undefined) {
    throw new Error('useAdminSettings must be used within an AdminSettingsProvider');
  }
  return context;
};