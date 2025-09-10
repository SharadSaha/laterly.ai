export const getSummarizationPrompt = (content: string): string => `
Summarize the following article in 3-4 sentences, focusing on the main ideas and insights:

"${content}"
`;
