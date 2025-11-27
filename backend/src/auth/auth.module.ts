import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MeController } from './me.controller';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  controllers: [AuthController, MeController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
