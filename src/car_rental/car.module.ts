import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cars } from 'src/entities/car.entity';
import { CarController } from './car.controller';
import { CarService } from './car.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Cars])
  ],
  exports:[TypeOrmModule],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
