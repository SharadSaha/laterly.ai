import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AIService } from 'src/ai/service';


@Injectable()
export class ArticleService {
  constructor(
    private prisma: PrismaService,
    private aiService: AIService,
  ) {}

  async createArticle(data: { url: string; title: string; content: string; userId: string }) {
    const { url, title, content, userId } = data;

    // Run AI processing
    const [summary, topicNames, intentPhrase] = await Promise.all([
      this.aiService.summarizeArticle(content),
      this.aiService.extractTopics(content),
      this.aiService.detectUserIntent(content),
    ]);

    // Upsert Topics
    const topics = await Promise.all(
      topicNames.map((name) =>
        this.prisma.topic.upsert({
          where: { value: name },
          update: {},
          create: { value: name },
        }),
      ),
    );

    // Upsert Intent
    const intent = await this.prisma.intent.upsert({
      where: { value: intentPhrase },
      update: {},
      create: { value: intentPhrase },
    });

    // Create Article and connect
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
}
