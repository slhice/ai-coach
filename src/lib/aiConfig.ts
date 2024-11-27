import OpenAI from 'openai';

const createChatModel = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('OpenAI API key not found in environment variables');
    return null;
  }
  
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
};

export const createTutoringChain = (subject: string) => {
  const openai = createChatModel();
  if (!openai) {
    return null;
  }

  return {
    invoke: async (input: string) => {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are an EMC AI Coach specializing in ${subject}.`
            },
            {
              role: 'user',
              content: input
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        });

        return completion.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.';
      } catch (error) {
        console.error('Error in tutoring chain:', error);
        return 'I apologize, but I encountered an error. Please try again.';
      }
    }
  };
};