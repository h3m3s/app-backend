import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer.config';
import { UploadService } from './upload.service';
import { CarService } from 'src/car_rental/car.service';
import type { MulterFile } from 'src/interfaces/Multerfile.interface';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly carService: CarService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadFile(@UploadedFile() file: MulterFile) {
    if (!file) throw new BadRequestException('No file provided');
    const uploaded = await this.uploadService.uploadFile(file);
    return uploaded;
  }

  // Upload image and attach to car (updates the car.photo field)
  @Post('/car/:id')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadCarImage(@Param('id') id: string, @UploadedFile() file: MulterFile) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) throw new BadRequestException('Invalid id');
    if (!file) throw new BadRequestException('No file provided');
    const uploaded = await this.uploadService.uploadFile(file);
    const updated = await this.carService.updateCar(numericId, { photo: uploaded.filename });
    return { uploaded, updated };
  }
}

