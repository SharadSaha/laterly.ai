import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  loginOrCreate(@Body() dto: LoginDto) {
    return this.authService.loginOrCreate(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  logout() {
    return {
      message: 'Logout successful',
    };
  }
}
