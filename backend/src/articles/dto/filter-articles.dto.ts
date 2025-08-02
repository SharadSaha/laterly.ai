// dto/filter-articles.dto.ts
import { IsArray, IsOptional, IsString } from 'class-validator';

export class FilterArticlesDto {
  @IsArray()
  @IsString({ each: true })
  topicIds: string[];

  @IsOptional()
  filterMode?: 'any' | 'all' | 'exact' | 'none';
}
