import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cars } from 'src/entities/car.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Rent } from 'src/entities/rent.entity';
import { user } from 'src/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'tebik',
      signOptions: {expiresIn: '1h'}
    })
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {
  
}
