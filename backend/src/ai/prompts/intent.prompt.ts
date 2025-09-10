export const getIntentPrompt = (note: string): string => `
You are an assistant. Based on the user's note, infer their intent or purpose in saving the article.
Respond with a short phrase like "research", "job prep", or "inspiration".

User note: "${note}"
`;
