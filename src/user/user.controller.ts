import {
    Body,
    Controller,
    Get,
    Post,
} from '@nestjs/common';
import { user } from 'src/entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) 
    {}

    @Get()
    async getAllUsers(): Promise<user[]> {
        return this.userService.getAllUsers();
    }
    @Post('login')
    loginUser(@Body() data: { email: string; password: string }): Promise<user | string> {
        return this.userService.loginUser(data);
    }
}