import { AdminSettings } from '../types/admin';

export const chatService = {
  async processMessage(message: string, settings: AdminSettings): Promise<string> {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY || settings.apiKey;

    if (!apiKey) {
      console.error('API key not configured');
      return "I'm unable to process your request at the moment. Please ensure the AI service is properly configured.";
    }

    try {
      const prompt = constructPrompt(message, settings);
      
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
              content: prompt
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: settings.responseStyle.length === 'concise' ? 150 : 300
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error processing message:', error);
      return "I apologize, but I'm having trouble processing your request at the moment. Please try again later.";
    }
  }
};

function constructPrompt(message: string, settings: AdminSettings): string {
  const {
    responseStyle,
    knowledgeSource,
    chatbotSettings
  } = settings;

  let prompt = responseStyle.basePrompt + '\n\n';

  // Add focus and description if available
  if (chatbotSettings.focus) {
    prompt += `Focus area: ${chatbotSettings.focus}\n`;
  }
  if (chatbotSettings.description) {
    prompt += `${chatbotSettings.description}\n`;
  }

  // Add response style instructions
  prompt += `\nResponse style:
- Tone: ${responseStyle.tone}
- Length: ${responseStyle.length}
- Language: ${responseStyle.language}\n`;

  // Add teaching approach instructions
  if (responseStyle.instructions.length > 0) {
    prompt += '\nTeaching approach:\n';
    responseStyle.instructions.forEach((instruction, index) => {
      prompt += `${index + 1}. ${instruction}\n`;
    });
  }

  // Add knowledge sources if available
  if (knowledgeSource.sources.length > 0) {
    prompt += '\nKnowledge sources:\n';
    knowledgeSource.sources.forEach(source => {
      prompt += `- ${source}\n`;
    });
  }

  // Add custom processing instructions if available
  if (knowledgeSource.customInstructions) {
    prompt += `\nProcessing instructions:\n${knowledgeSource.customInstructions}\n`;
  }

  return prompt;
}