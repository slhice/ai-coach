import { TutorConfig } from '../types';

export interface KnowledgeBaseConfig {
  openAIApiKey: string;
  customInstructions: string;
  systemPrompt: string;
}

export const generateCustomInstructions = (config: TutorConfig): string => {
  return `Use the following knowledge base for ${config.subject}:

${config.materials.map(m => `
Topic: ${m.title}
Content: ${m.content}
`).join('\n')}

When responding:
1. Draw from this knowledge base first
2. Use specific examples from the materials
3. Reference relevant modules and topics
4. Maintain consistency with the course structure`;
};

export const generateSystemPrompt = (config: TutorConfig): string => {
  return `You are an AI tutor for ${config.subject} at ${config.organization || 'Excellence in Manufacturing (EMC)'}.
Your role is to help students understand concepts from the course materials.

Key guidelines:
- Focus on the provided course materials
- Use practical examples from manufacturing
- Emphasize safety and best practices
- Maintain a supportive teaching style`;
};

export const getKnowledgeBaseConfig = (config: TutorConfig): KnowledgeBaseConfig => {
  return {
    openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    customInstructions: generateCustomInstructions(config),
    systemPrompt: generateSystemPrompt(config)
  };
};

export const exportForChatGPT = (config: TutorConfig): string => {
  const { customInstructions, systemPrompt } = getKnowledgeBaseConfig(config);
  
  return `${systemPrompt}

${customInstructions}

Additional Notes:
- This knowledge base is from an EMC training course
- Focus on manufacturing applications
- Encourage practical understanding`;
};

export const exportForSynthflow = (config: TutorConfig): string => {
  const { customInstructions, systemPrompt } = getKnowledgeBaseConfig(config);
  
  return `System: ${systemPrompt}
Context: ${customInstructions}
Voice Style: Professional and supportive
Response Format: Conversational and clear`;
};