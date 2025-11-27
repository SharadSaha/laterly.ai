import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { normalizeIntent, normalizeTopic } from './utils/normalization';
import { Prisma } from '@prisma/client';
import { AIService } from 'src/ai/service';

@Injectable()
export class ArticleService {
  constructor(
    private prisma: PrismaService,
    private aiService: AIService,
  ) {}

  async createArticle(
    data: {
      url: string;
      title: string;
      content: string;
      intent: string;
    },
    userId: string,
  ) {
    const { url, title, content, intent: intentData } = data;

    const [summary, rawTopicNames, rawIntentPhrase] = await Promise.all([
      this.aiService.summarizeArticle(content),
      this.aiService.extractTopics(content),
      this.aiService.detectUserIntent(intentData),
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

  async toggleReadState(articleId: string, userId: string) {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article || article.userId !== userId) {
      throw new NotFoundException('Article not found or access denied');
    }

    return this.prisma.article.update({
      where: { id: articleId },
      data: { isRead: !article.isRead },
    });
  }

  async toggleBookmark(articleId: string, userId: string) {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article || article.userId !== userId) {
      throw new NotFoundException('Article not found or access denied');
    }

    return this.prisma.article.update({
      where: { id: articleId },
      data: { isBookmarked: !article.isBookmarked },
    });
  }

  async getArticleById(articleId: string, userId: string) {
    const article = await this.prisma.article.findFirst({
      where: { id: articleId, userId },
      include: { topics: true, intents: true },
    });

    if (!article) {
      throw new NotFoundException('Article not found or access denied');
    }

    return article;
  }

  async getArticles(
    userId: string,
    {
      topicIds,
      rawIntent,
      skip = 0,
      take = 20,
    }: {
      topicIds?: string[];
      rawIntent?: string;
      skip?: number;
      take?: number;
    },
  ) {
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
      const tokens = normalized.split(/\s+/).filter((t) => t.length > 2);

      const matchedIntents = await this.prisma.intent.findMany({
        where: {
          OR: [
            { value: { contains: normalized, mode: Prisma.QueryMode.insensitive } },
            ...tokens.map((token) => ({
              value: { contains: token, mode: Prisma.QueryMode.insensitive },
            })),
          ],
        },
        select: { id: true },
      });

      const intentIds = matchedIntents.map((i) => i.id);

      where.AND = [
        {
          OR: [
            intentIds.length
              ? {
                  intents: {
                    some: {
                      id: { in: intentIds },
                    },
                  },
                }
              : undefined,
            { title: { contains: rawIntent, mode: Prisma.QueryMode.insensitive } },
            { summary: { contains: rawIntent, mode: Prisma.QueryMode.insensitive } },
            { content: { contains: rawIntent, mode: Prisma.QueryMode.insensitive } },
          ].filter(Boolean) as Prisma.ArticleWhereInput[],
        },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        include: {
          topics: true,
          intents: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take,
      }),
      this.prisma.article.count({ where }),
    ]);

    return { items, total };
  }
}
