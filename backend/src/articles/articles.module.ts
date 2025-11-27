import { Module } from '@nestjs/common';
import { ArticleService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { IntentsController } from './intents.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AIService } from 'src/ai/service';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';

@Module({
  controllers: [ArticlesController, IntentsController],
  providers: [ArticleService, PrismaService, AIService, JwtGuard],
})
export class ArticlesModule {}
