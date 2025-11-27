import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { Request } from 'express';

@UseGuards(JwtGuard)
@Controller('intents')
export class IntentsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('trending')
  async trending(@Req() req: Request) {
    const userId = req.user.sub;

    const intents = await this.prisma.intent.findMany({
      where: {
        articles: {
          some: { userId },
        },
      },
      include: {
        _count: { select: { articles: true } },
      },
      orderBy: {
        articles: { _count: 'desc' },
      },
      take: 10,
    });

    return intents.map((intent) => ({
      id: intent.id,
      phrase: intent.value,
      count: intent._count.articles,
    }));
  }
}
