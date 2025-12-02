import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RentService } from './rent.service';

@Controller('rent')
export class RentController {
  constructor(private readonly rentService: RentService) {}

  @Get()
  findAll() {
    return this.rentService.findAll();
  }

  @Get('car/:carId')
  findByCar(@Param('carId') carId: string) {
    const numericId = this.toNumber(carId, 'carId');
    return this.rentService.findByCar(numericId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const numericId = this.toNumber(id, 'id');
    return this.rentService.findOne(numericId);
  }

  @Post('car/:carId')
  createForCar(@Param('carId') carId: string, @Body() body: any) {
    const numericId = this.toNumber(carId, 'carId');
    return this.rentService.createForCar(numericId, body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    const numericId = this.toNumber(id, 'id');
    return this.rentService.update(numericId, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const numericId = this.toNumber(id, 'id');
    return this.rentService.remove(numericId);
  }

  private toNumber(value: string, field: string): number {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      throw new BadRequestException(`${field} must be a number`);
    }
    return numeric;
  }
}
