import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from 'langchain/prompts';
import { LLMChain } from 'langchain/chains';

const createChatModel = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('OpenAI API key not found in environment variables');
    return null;
  }
  
  return new ChatOpenAI({
    openAIApiKey: apiKey,
    modelName: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    presencePenalty: 0.6,
    frequencyPenalty: 0.5,
  });
};

const createSpecializedPrompt = (subject: string) => {
  return ChatPromptTemplate.fromTemplate(`
You are an EMC AI Coach specializing in {subject}. You support 18-24 year old students in Canada learning manufacturing basics.

Context: {context}

Student's Question: {question}

Follow these coaching principles:
1. Start with a warm welcome and acknowledge the student's current progress
2. Use analogies and examples relevant to manufacturing
3. Provide visual explanations when possible
4. Encourage critical thinking through interactive scenarios
5. Address any signs of feeling overwhelmed or technical confusion
6. Maintain engagement through practical applications
7. Close with encouragement and clear next steps

Response:`);
};

export const createTutoringChain = (subject: string, context: string) => {
  const model = createChatModel();
  if (!model) {
    return null;
  }

  const prompt = createSpecializedPrompt(subject);
  const chain = new LLMChain({ llm: model, prompt });

  return async (input: string) => {
    try {
      const response = await chain.call({
        subject,
        context,
        question: input
      });
      return response.text;
    } catch (error) {
      console.error('Error in tutoring chain:', error);
      throw error;
    }
  };
};

export const loadCustomKnowledgeBase = async (sources: string[]) => {
  try {
    const context = sources.join('\n\n');
    return context;
  } catch (error) {
    console.error('Error loading knowledge base:', error);
    return '';
  }
};