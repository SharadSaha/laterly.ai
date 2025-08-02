import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AIService } from 'src/ai/service';
import { normalizeIntent, normalizeTopic } from './utils/normalization';
import { Prisma } from '@prisma/client';

@Injectable()
export class ArticleService {
  constructor(
    private prisma: PrismaService,
    private aiService: AIService,
  ) {}

  async createArticle(data: {
    url: string;
    title: string;
    content: string;
    userId: string;
  }) {
    const { url, title, content, userId } = data;

    const [summary, rawTopicNames, rawIntentPhrase] = await Promise.all([
      this.aiService.summarizeArticle(content),
      this.aiService.extractTopics(content),
      this.aiService.detectUserIntent(content),
    ]);

    const normalizedTopics = [
      ...new Set(rawTopicNames.map(normalizeTopic).filter(Boolean)),
    ];
    const normalizedIntent = normalizeIntent(rawIntentPhrase);

    const topics = await Promise.all(
      normalizedTopics.map((name) =>
        this.prisma.topic.upsert({
          where: { value: name },
          update: {},
          create: { value: name },
        }),
      ),
    );

    const intent = await this.prisma.intent.upsert({
      where: { value: normalizedIntent },
      update: {},
      create: { value: normalizedIntent },
    });

    const article = await this.prisma.article.create({
      data: {
        url,
        title,
        content,
        summary,
        user: { connect: { id: userId } },
        topics: {
          connect: topics.map((t) => ({ id: t.id })),
        },
        intents: {
          connect: [{ id: intent.id }],
        },
      },
    });

    return article;
  }

  async deleteArticle(articleId: string, userId: string): Promise<void> {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article || article.userId !== userId) {
      throw new NotFoundException('Article not found or access denied');
    }

    await this.prisma.article.delete({ where: { id: articleId } });
  }

  async markArticleAsRead(articleId: string, userId: string): Promise<void> {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article || article.userId !== userId) {
      throw new NotFoundException('Article not found or access denied');
    }

    await this.prisma.article.update({
      where: { id: articleId },
      data: { isRead: true },
    });
  }

  async getArticles(userId: string, topicIds?: string[], rawIntent?: string) {
    const where: Prisma.ArticleWhereInput = {
      userId,
    };

    if (topicIds?.length) {
      where.topics = {
        some: {
          id: { in: topicIds },
        },
      };
    }

    if (rawIntent?.trim()) {
      const normalized = normalizeIntent(rawIntent);

      const matchedIntents = await this.prisma.intent.findMany({
        where: {
          value: {
            contains: normalized,
            mode: 'insensitive',
          },
        },
        select: { id: true },
      });

      const intentIds = matchedIntents.map((i) => i.id);

      // If no match, return empty
      if (intentIds.length === 0) return [];

      where.intents = {
        some: {
          id: { in: intentIds },
        },
      };
    }

    return this.prisma.article.findMany({
      where,
      include: {
        topics: true,
        intents: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
