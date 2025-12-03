import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rent } from 'src/entities/rent.entity';
import { user } from 'src/entities/user.entity';
import { RentService } from './rent.service';
import { RentController } from './rent.controller';
import { CarModule } from 'src/car_rental/car.module';

@Module({
  imports: [TypeOrmModule.forFeature([Rent, user]), CarModule],
  controllers: [RentController],
  providers: [RentService],
  exports: [RentService],
})
export class RentModule {}
