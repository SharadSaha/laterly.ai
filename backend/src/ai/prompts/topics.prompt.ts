import { ChatCompletionMessageParam } from 'openai/resources/index';

export const getTopicsPrompt = (
  article: string,
): ChatCompletionMessageParam[] => [
  {
    role: 'system',
    content:
      'Extract 3 to 5 lowercase, comma-separated topic tags (no hashtags) from this article to help categorize it.',
  },
  {
    role: 'user',
    content: article,
  },
];
