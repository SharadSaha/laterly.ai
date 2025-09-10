import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSummarizationPrompt } from './prompts/summarization.prompt';
import { getTopicsPrompt } from './prompts/topics.prompt';
import { getIntentPrompt } from './prompts/intent.prompt';
import { getDigestPrompt } from './prompts/digest.prompt';

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private readonly genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }

  private async generateResponse(prompt: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      this.logger.error('Gemini API call failed', error);
      throw new Error('AI request failed');
    }
  }

  async summarizeArticle(content: string): Promise<string> {
    try {
      const prompt = getSummarizationPrompt(content);
      return await this.generateResponse(prompt);
    } catch (error) {
      this.logger.error('Summarization failed', error);
      throw new Error('Failed to summarize article');
    }
  }

  async extractTopics(content: string): Promise<string[]> {
    try {
      const prompt = getTopicsPrompt(content);
      const text = await this.generateResponse(prompt);
      return text
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean);
    } catch (error) {
      this.logger.error('Topic extraction failed', error);
      return [];
    }
  }

  async detectUserIntent(note: string): Promise<string> {
    if (!note) return 'unspecified';
    try {
      const prompt = getIntentPrompt(note);
      return await this.generateResponse(prompt);
    } catch (error) {
      this.logger.error('Intent detection failed', error);
      return 'unspecified';
    }
  }

  async createWeeklyDigestSummary(summaries: string[]): Promise<string> {
    if (!summaries.length) return 'No saved articles.';
    try {
      const prompt = getDigestPrompt(summaries);
      return await this.generateResponse(prompt);
    } catch (error) {
      this.logger.error('Digest generation failed', error);
      return 'Could not generate digest.';
    }
  }
}
