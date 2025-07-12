import { ChatCompletionMessageParam } from 'openai/resources/index';

export const getSummarizationPrompt = (
  article: string,
): ChatCompletionMessageParam[] => [
  {
    role: 'system',
    content:
      'You are a helpful assistant. Summarize this article in 5 concise bullet points.',
  },
  {
    role: 'user',
    content: article,
  },
];
