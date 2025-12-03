import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarModule } from './car_rental/car.module';
import { LoginModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { RentModule } from './rent/rent.module';
@Module({

  imports: [
    CarModule,
    LoginModule,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
