import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Patch,
  Req,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { ArticleService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';

@UseGuards(JwtGuard)
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticleService) {}

  @Post()
  create(@Body() dto: CreateArticleDto, @Req() req: Express.Request) {
    const userId = req.user.sub;
    return this.articlesService.createArticle(dto, userId);
  }

  @Delete(':id')
  async deleteArticle(@Param('id') id: string, @Req() req: Express.Request) {
    const userId = req.user.sub;
    await this.articlesService.deleteArticle(id, userId);
    return { message: 'Article deleted' };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req: Express.Request) {
    const userId = req.user.sub;
    await this.articlesService.markArticleAsRead(id, userId);
    return { message: 'Article marked as read' };
  }

  @Get()
  filterArticles(
    @Query('topic_ids') topicIdsRaw: string,
    @Query('intent') intentRaw: string,
    @Req() req: Express.Request,
  ) {
    const userId = req.user.sub;

    const topicIds = topicIdsRaw?.split(',').filter(Boolean);

    return this.articlesService.getArticles(userId, topicIds, intentRaw);
  }
}
