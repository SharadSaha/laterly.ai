import { IsString, IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  intent: string;

  @IsString()
  title: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
