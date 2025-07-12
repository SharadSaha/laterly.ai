import { ChatCompletionMessageParam } from 'openai/resources/index';

export const getDigestPrompt = (
  summaries: string[],
): ChatCompletionMessageParam[] => [
  {
    role: 'system',
    content:
      'You are a friendly assistant generating a weekly reading digest email. Write a warm, human-like summary for these articles.',
  },
  {
    role: 'user',
    content: summaries.map((s, i) => `Article ${i + 1}: ${s}`).join('\n\n'),
  },
];
