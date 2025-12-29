import { Controller, Get, Param, Delete, BadRequestException, Post, Body, Patch, Query, UseGuards } from '@nestjs/common';
import { CarService } from './car.service';
import type { Car } from 'src/interfaces/Car.interface';
import { JwtGuard } from 'src/@auth/jwt.guard.';

@Controller('car')
@UseGuards(JwtGuard)
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get()
  findAllCars(): Promise<Car[]>{
    return this.carService.findAll();
  }

  @Get('/id/:id')
  findCarById(@Param('id') id: number): Promise<Car | null> {
   return this.carService.findCarById(id);
  }
  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteCar(@Param('id') id: string): Promise<void> {
    const numId = Number(id);
    if (Number.isNaN(numId)) throw new BadRequestException('Invalid id');
    await this.carService.deleteCar(numId);
  }
  @UseGuards(JwtGuard)
  @Post('/add')
  async addCar(@Body() data: Car): Promise<string> {
    if (!data || !data.brand || !data.model || !data.price) {
      throw new BadRequestException('Missing data, please make sure u enter all data');
    }
    this.carService.createCar(data);
    return `Dodano Samochód ${data.brand} ${data.model} w cenie ${data.price}`
  }
  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateCarDetails(@Param('id') id: number,@Body() carData: Partial<Car>,): Promise<object> {
    if (Number.isNaN(id)) throw new BadRequestException('Invalid id');
    const updated = await this.carService.updateCar(id, carData);
    return updated;
  }
  //Search Cars
  @Get('/search')
  async searchCarsQuery(@Query() query: Partial<Car>): Promise<object | string> {
    return this.carService.searchCars(query);
  }

  @Post('/search')
  async searchCars(@Body() carData: Partial<Car>): Promise<object | string>{
    return this.carService.searchCars(carData);
  }
}
