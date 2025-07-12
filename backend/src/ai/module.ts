import { Module } from '@nestjs/common';
import { AIService } from './service';

@Module({
  providers: [AIService],
  exports: [AIService],
})
export class AIModule {}
