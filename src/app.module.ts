import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CarModule } from './@car_rental/car.module';
import { AuthModule } from './@auth/auth.module';
import { UploadModule } from './@upload/upload.module';
import { RentModule } from './@rent/rent.module';
import { UserModule } from './@user/user.module';
@Module({

  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', 'src/.env'] }),
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
  providers: [AppService],
})
export class AppModule {}
