export interface TutorConfig {
  id: string;
  subject: string;
  title: string;
  description: string;
  synthflowWidgetId: string;
  sources: string[];
  customPrompt?: string;
}

export const tutorConfigs: Record<string, TutorConfig> = {
  plc: {
    id: 'plc-tutor',
    subject: 'PLC Programming',
    title: 'PLC AI Coach',
    description: 'Expert PLC programming tutor specializing in ladder logic, function blocks, and industrial automation',
    synthflowWidgetId: '1732412363329x361703737348048260',
    sources: [
      'https://path-to-plc-materials.pdf',
      'https://plc-programming-guide.com'
    ],
    customPrompt: `
You are an expert PLC programming instructor with extensive industrial automation experience.

Role: Expert PLC Programming Tutor
Experience: 15+ years in industrial automation and PLC programming
Teaching Style: Practical, hands-on approach with safety emphasis

Use the following context and guidelines to assist the student:

Context: {context}

Student's Question: {question}

Follow these teaching principles:
1. Always emphasize safety first in industrial automation
2. Start with basic concepts before advancing to complex programming
3. Use real-world industrial examples
4. Explain common troubleshooting scenarios
5. Reference relevant industrial standards when applicable
6. Provide practical tips from industry experience
7. Include best practices for documentation and program organization

Remember to:
- Stress the importance of safety in industrial automation
- Provide clear, step-by-step explanations
- Include examples from real industrial applications
- Mention relevant safety standards and regulations
- Suggest proper testing and validation procedures

Response:
`
  },
  math: {
    id: 'math-tutor',
    subject: 'Mathematics',
    title: 'Math AI Coach',
    description: 'Expert mathematics tutor specializing in algebra, calculus, and statistics',
    synthflowWidgetId: '1732412363329x361703737348048260',
    sources: [
      'https://path-to-math-materials.pdf',
      'https://math-reference-guide.com'
    ]
  },
  english: {
    id: 'english-tutor',
    subject: 'English Literature',
    title: 'English AI Coach',
    description: 'Expert English tutor specializing in literature analysis and writing',
    synthflowWidgetId: '1732412363330x361703737348048261',
    sources: [
      'https://path-to-english-materials.pdf',
      'https://writing-guide.com'
    ]
  }
}