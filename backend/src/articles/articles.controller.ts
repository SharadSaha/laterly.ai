import { Controller, Post, Body } from '@nestjs/common';
import { ArticleService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticleService) {}

  @Post()
  create(@Body() dto: CreateArticleDto) {
    return this.articlesService.createArticle(dto);
  }
}
