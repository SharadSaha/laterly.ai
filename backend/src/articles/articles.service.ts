import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AIService } from 'src/ai/service';
import { normalizeIntent, normalizeTopic } from './utils/normalization';

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

  async filterArticlesByTopics(
    userId: string,
    topicIds: string[],
    filterMode: 'any' | 'all' | 'exact' | 'none' = 'any',
  ) {
    switch (filterMode) {
      case 'any':
        return this.prisma.article.findMany({
          where: {
            userId,
            topics: {
              some: {
                id: { in: topicIds },
              },
            },
          },
          include: { topics: true },
        });

      case 'all':
        return this.prisma.article.findMany({
          where: {
            userId,
            AND: topicIds.map((id) => ({
              topics: {
                some: { id },
              },
            })),
          },
          include: { topics: true },
        });

      case 'none':
        return this.prisma.article.findMany({
          where: {
            userId,
            NOT: {
              topics: {
                some: {
                  id: { in: topicIds },
                },
              },
            },
          },
          include: { topics: true },
        });

      case 'exact':
        return this.prisma.article.findMany({
          where: {
            userId,
            AND: [
              {
                topics: {
                  every: {
                    id: { in: topicIds },
                  },
                },
              },
              {
                topics: {
                  none: {
                    id: { notIn: topicIds },
                  },
                },
              },
            ],
          },
          include: { topics: true },
        });

      default:
        throw new Error('Invalid filter mode');
    }
  }

  async filterArticlesByIntent(userId: string, rawIntent: string) {
    const intentQuery = normalizeIntent(rawIntent);

    const intents = await this.prisma.intent.findMany({
      where: {
        value: {
          contains: intentQuery,
          mode: 'insensitive',
        },
      },
      select: { id: true },
    });

    if (!intents.length) {
      return [];
    }

    const intentIds = intents.map((i) => i.id);

    return this.prisma.article.findMany({
      where: {
        userId,
        intents: {
          some: {
            id: { in: intentIds },
          },
        },
      },
      include: { intents: true, topics: true },
    });
  }
}
