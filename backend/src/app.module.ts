import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [AuthModule, ArticlesModule],
})
export class AppModule {}
