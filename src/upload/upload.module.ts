import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from './multer.config';
import { CarModule } from 'src/car_rental/car.module';

@Module({
  imports: [MulterModule.register(multerOptions), CarModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
