// backend/src/ai/ai.service.ts
import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { getSummarizationPrompt } from './prompts/summarization.prompt';
import { getTopicsPrompt } from './prompts/topics.prompt';
import { getIntentPrompt } from './prompts/intent.prompt';
import { getDigestPrompt } from './prompts/digest.prompt';

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async summarizeArticle(content: string): Promise<string> {
    try {
      const messages = getSummarizationPrompt(content);
      const res = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
      });
      return res.choices[0].message?.content?.trim() || '';
    } catch (error) {
      this.logger.error('Summarization failed', error);
      throw new Error('Failed to summarize article');
    }
  }

  async extractTopics(content: string): Promise<string[]> {
    try {
      const messages = getTopicsPrompt(content);
      const res = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
      });
      const text = res.choices[0].message?.content || '';
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
      const messages = getIntentPrompt(note);
      const res = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
      });
      return res.choices[0].message?.content?.trim() || 'unspecified';
    } catch (error) {
      this.logger.error('Intent detection failed', error);
      return 'unspecified';
    }
  }

  async createWeeklyDigestSummary(summaries: string[]): Promise<string> {
    if (!summaries.length) return 'No saved articles.';

    try {
      const messages = getDigestPrompt(summaries);
      const res = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
      });
      return res.choices[0].message?.content?.trim() || '';
    } catch (error) {
      this.logger.error('Digest generation failed', error);
      return 'Could not generate digest.';
    }
  }
}
