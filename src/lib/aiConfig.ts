import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { TutorConfig } from '../config/specialization';
import { defaultCoachingConfig } from '../config/coaching';

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

const createSpecializedPrompt = (config: TutorConfig) => ChatPromptTemplate.fromTemplate(`
You are an EMC AI Coach specializing in ${config.subject}. You support 18-24 year old students in Canada learning manufacturing basics.

Role: Expert ${config.subject} Coach for ${defaultCoachingConfig.organization}
Experience: Advanced knowledge with proven teaching experience
Teaching Style: Interactive, supportive, and practical

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

Remember to:
- Stay aligned with EMC's educational approach
- Use age-appropriate examples and explanations
- Reference specific course materials when relevant
- Offer additional resources when needed
- Provide constructive feedback and encouragement
- Address common objections with empathy
- Maintain a supportive and motivating tone

Response:
`);

export const createTutoringChain = (subject: string, context: string, apiKey?: string) => {
  const model = createChatModel();
  if (!model) {
    return null;
  }

  const config: TutorConfig = {
    id: 'tutor',
    subject,
    title: `${subject} AI Coach`,
    description: `Expert ${subject} tutor`,
    synthflowWidgetId: '',
    sources: []
  };

  const specializedPrompt = createSpecializedPrompt(config);

  return RunnableSequence.from([
    {
      question: (input: string) => input,
      subject: () => config.subject,
      context: () => context,
    },
    specializedPrompt,
    model,
    new StringOutputParser(),
  ]);
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