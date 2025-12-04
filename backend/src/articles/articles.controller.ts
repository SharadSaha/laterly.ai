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
    const updated = await this.articlesService.toggleReadState(id, userId);
    return { message: 'Article read state updated', article: updated };
  }

  @Patch(':id/bookmark')
  async toggleBookmark(@Param('id') id: string, @Req() req: Express.Request) {
    const userId = req.user.sub;
    const updated = await this.articlesService.toggleBookmark(id, userId);
    return { message: 'Bookmark state updated', article: updated };
  }

  @Get(':id')
  async getOne(@Param('id') id: string, @Req() req: Express.Request) {
    const userId = req.user.sub;
    return this.articlesService.getArticleById(id, userId);
  }

  @Post(':id/resummarize')
  async resummarize(@Param('id') id: string, @Req() req: Express.Request) {
    const userId = req.user.sub;
    return this.articlesService.resummarize(id, userId);
  }

  @Get()
  filterArticles(
    @Query('topic_ids') topicIdsRaw: string,
    @Query('intent') intentRaw: string,
    @Query('skip') skipRaw: string,
    @Query('take') takeRaw: string,
    @Req() req: Express.Request,
  ) {
    const userId = req.user.sub;

    const topicIds = topicIdsRaw?.split(',').filter(Boolean);
    const skip = Number(skipRaw) || 0;
    const take = Number(takeRaw) || 20;

    return this.articlesService.getArticles(userId, {
      topicIds,
      rawIntent: intentRaw,
      skip,
      take,
    });
  }
}
