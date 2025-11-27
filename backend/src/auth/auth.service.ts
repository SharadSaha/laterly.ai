import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async loginOrCreate(dto: LoginDto) {
    let user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      const hashed = await bcrypt.hash(dto.password, 10);
      user = await this.prisma.user.create({
        data: { email: dto.email, name: dto.name || '', password: hashed },
      });
    } else {
      const isMatch = await bcrypt.compare(dto.password, user.password);
      if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    }

    return this.signToken(user.id, user.email);
  }

  signToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    return { access_token: this.jwt.sign(payload) };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        // createdAt might not exist in schema; fallback handled below.
      },
    });

    const [total, unread, bookmarked] = await Promise.all([
      this.prisma.article.count({ where: { userId } }),
      this.prisma.article.count({ where: { userId, isRead: false } }),
      this.prisma.article.count({ where: { userId, isBookmarked: true } }),
    ]);

    return {
      id: user?.id ?? userId,
      email: user?.email ?? '',
      name: user?.name ?? '',
      joinedOn: (user as any)?.createdAt ?? null,
      stats: {
        total,
        bookmarked,
        unread,
        opened: total - unread,
      },
    };
  }
}
