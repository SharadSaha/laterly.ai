import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { Request } from 'express';

@UseGuards(JwtGuard)
@Controller('topics')
export class TopicsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list(@Req() req: Request) {
    const userId = req.user.sub;
    const topics = await this.prisma.topic.findMany({
      where: {
        articles: {
          some: { userId },
        },
      },
      include: {
        _count: {
          select: { articles: true },
        },
      },
      orderBy: { value: 'asc' },
    });

    return topics.map((t) => ({ id: t.id, value: t.value, count: t._count.articles }));
  }
}
