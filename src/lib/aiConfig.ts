export const createTutoringChain = (subject: string, context: string) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('OpenAI API key not found');
    return null;
  }

  return {
    invoke: async (input: string) => {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: `You are an AI tutor specializing in ${subject}. ${context}`
              },
              {
                role: 'user',
                content: input
              }
            ],
            temperature: 0.7,
            max_tokens: 2000
          })
        });

        const data = await response.json();
        return data.choices[0].message.content;
      } catch (error) {
        console.error('Error calling OpenAI:', error);
        return 'I apologize, but I encountered an error. Please try again.';
      }
    }
  };
};