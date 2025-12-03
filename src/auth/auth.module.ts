import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cars } from 'src/entities/car.entity';
import { AuthController } from './auth.controller';
import { LoginService } from './auth.service';
import { Rent } from 'src/entities/rent.entity';
import { user } from 'src/entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Cars, Rent, user])
  ],
  exports:[TypeOrmModule, LoginService],
  controllers: [AuthController],
  providers: [LoginService],
})
export class LoginModule {
  
}
