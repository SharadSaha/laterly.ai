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
import { FilterArticlesDto } from './dto/filter-articles.dto';

@UseGuards(JwtGuard)
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticleService) {}

  @Post()
  create(@Body() dto: CreateArticleDto) {
    return this.articlesService.createArticle(dto);
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

  @Get('filter-by-topics')
  filterByTopics(
    @Query() query: FilterArticlesDto,
    @Req() req: Express.Request,
  ) {
    const userId = req.user.sub;
    return this.articlesService.filterArticlesByTopics(
      userId,
      query.topicIds,
      query.filterMode || 'any',
    );
  }

  @Get('filter-by-intent')
  filterByIntent(
    @Query('intent') rawIntent: string,
    @Req() req: Express.Request,
  ) {
    const userId = req.user.sub;
    return this.articlesService.filterArticlesByIntent(userId, rawIntent);
  }
}
