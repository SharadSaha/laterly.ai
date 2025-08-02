import { Module } from '@nestjs/common';
import { ArticleService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AIService } from 'src/ai/service';

@Module({
  controllers: [ArticlesController],
  providers: [ArticleService, PrismaService, AIService],
})
export class ArticlesModule {}
