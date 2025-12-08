import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarModule } from './car_rental/car.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { RentModule } from './rent/rent.module';
import { AuthService } from './auth/auth.service';
import { UserModule } from './user/user.module';
@Module({

  imports: [
    CarModule,
    AuthModule,
    UploadModule,
    RentModule,
    TypeOrmModule.forRoot({
      type: 'mysql', 
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'car_rental',
      entities: [__dirname + '/entities/*.ts'],
      autoLoadEntities: true,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
