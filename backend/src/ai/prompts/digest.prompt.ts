export const getDigestPrompt = (summaries: string[]): string => `
Create a weekly digest summary from the following saved article summaries.
Make it concise, structured, and engaging:

${summaries.map((s, i) => `Article ${i + 1}: ${s}`).join('\n')}
`;
