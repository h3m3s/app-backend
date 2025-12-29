import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'node_modules/bcryptjs';
import { UserService } from 'src/@user/user.service';

@Injectable()
export class AuthService {

    constructor(
      private readonly userService: UserService,
      private readonly jwtService: JwtService
    ) {}

    async validateUser( email: string, userPassword: string ){
      const user = await this.userService.isUserExist({email});
      if(!user){
        throw new UnauthorizedException('Nieprawidłowe dane logowania');
      }

      const passwordValid = await bcrypt.compare(userPassword, user.password);
      if(!passwordValid){
        throw new UnauthorizedException('Nieprawidłowe dane logowania');
      }
      
      return {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isPermitted: user.isPermitted,
      };
    }

    async register(data: {
      email: string;
      password: string;
      username: string;
      firstName: string;
      lastName: string;
      phone: number;
    }) {
      const newUser = await this.userService.createUser(data);
      
      return {
        message: 'User registered successfully'
      };
    }

    async login(user: any){
      const payload = {email: user.email, sub: user.id, isPermitted: user.isPermitted};
      return {
        access_token: this.jwtService.sign(payload),
      };
    }

  }

