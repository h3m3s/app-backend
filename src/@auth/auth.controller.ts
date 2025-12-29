import { Controller, Post, Body, UseGuards, Get, Req} from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto } from 'src/interfaces/login.model';
import { registerDto } from 'src/interfaces/register.model';
import { JwtGuard } from './jwt.guard.';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('login')
  async login(@Body() body: loginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: registerDto) {
    return this.authService.register(body);
  }

  @UseGuards(JwtGuard)
  @Get('user')
  getProfile(@Req() req){
    return req.user;
  }

 }
