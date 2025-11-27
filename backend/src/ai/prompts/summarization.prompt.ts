export const getSummarizationPrompt = (content: string): string => `
Summarize the following article in a rich, cohesive narrative of roughly 300-400 words. Focus on the core ideas, key insights, and any practical takeaways. Avoid bullet points; write in clear paragraphs. If the source text is too short to reasonably reach that length, provide a proportional summary instead of padding with fluff.

"${content}"
`;
