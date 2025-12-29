import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cars } from 'src/entities/car.entity';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { Rent } from 'src/entities/rent.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Cars, Rent])
  ],
  exports:[TypeOrmModule, CarService],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
