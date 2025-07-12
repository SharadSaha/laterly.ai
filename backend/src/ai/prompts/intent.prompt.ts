import { ChatCompletionMessageParam } from 'openai/resources/index';

export const getIntentPrompt = (note: string): ChatCompletionMessageParam[] => [
  {
    role: 'system',
    content:
      'Based on the user\'s note, infer their intent or purpose in saving the article. Respond with a short phrase like "research", "job prep", or "inspiration".',
  },
  {
    role: 'user',
    content: note,
  },
];
