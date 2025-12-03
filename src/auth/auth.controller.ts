import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { LoginService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: LoginService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('user/:id')
  getUser(@Param('id') id: string) {
    return this.authService.findById(Number(id));
  }

  @Get('users')
  getUsers() {
    return this.authService.findAll();
  }
}

