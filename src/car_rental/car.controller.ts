import { Controller, Get, Param } from '@nestjs/common';
import { CarService } from './car.service';
import { Cars } from 'src/entities/car.entity';
import { Car } from 'src/interfaces/Car.interface';

@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get()
  findAllCars(): Promise<Cars[]>{
    return this.carService.findAll();
  }

  @Get('/id/:id')
  findCarById(@Param('id') id: number): Promise<Cars | null> {
   return this.carService.findCarById(id);
  }
  @Get('/brand/:brand')
  findByBrand(@Param('brand') brand: string): Promise<Cars[]> {
   return this.carService.findByBrand(brand);
  }
}
