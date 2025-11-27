import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller()
export class MeController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  me(@Req() req: Request) {
    return this.authService.getProfile(req.user.sub);
  }
}
