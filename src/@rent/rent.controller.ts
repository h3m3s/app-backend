import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { RentService } from './rent.service';
import { JwtGuard } from 'src/@auth/jwt.guard.';

@Controller('rent')
export class RentController {
  constructor(private readonly rentService: RentService) {}
  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.rentService.findAll();
  }
  @UseGuards(JwtGuard)
  @Get('car/:carId')
  findByCar(@Param('carId') carId: string) {
    const numericId = this.toNumber(carId, 'carId');
    return this.rentService.findByCar(numericId);
  }
  @UseGuards(JwtGuard)@UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    const numericId = this.toNumber(id, 'id');
    return this.rentService.findOne(numericId);
  }
  @UseGuards(JwtGuard)
  @Post('car/:carId')
  createForCar(@Param('carId') carId: string, @Body() body: any) {
    const numericId = this.toNumber(carId, 'carId');
    return this.rentService.createForCar(numericId, body);
  }
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    const numericId = this.toNumber(id, 'id');
    return this.rentService.update(numericId, body);
  }
  @UseGuards(JwtGuard)
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
