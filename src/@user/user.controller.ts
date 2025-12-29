import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
} from '@nestjs/common';
import { user } from 'src/entities/user.entity';
import { UserService } from './user.service';
import { JwtGuard } from 'src/@auth/jwt.guard.';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) 
    {}
    @UseGuards(JwtGuard)
    @Get()
    async getAllUsers(): Promise<user[]> {
        return this.userService.getAllUsers();
    }
    @Post('login')
    loginUser(@Body() data: { email: string; password: string }): Promise<user | null> {
        return this.userService.isUserExist({ email: data.email });
    }
}   