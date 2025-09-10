export const getTopicsPrompt = (content: string): string => `
Extract 3-5 key topics or tags from the following article. Return them as a comma-separated list:

"${content}"
`;
