import { Injectable } from '@nestjs/common';
import { Data } from '../interfaces/Data.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Cars } from 'src/entities/car.entity';
import { Repository } from 'typeorm';
import { Car } from 'src/interfaces/Car.interface';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Cars)
    private carRespository: Repository<Cars>,
  ) {}
  findAll(): Promise<Cars[]> {
    return this.carRespository.find();
  }

  findCarById(id: number): Promise<Cars | null> {
    return this.carRespository.findOne({ where: { id } });
  }
  findByBrand(brand: string): Promise<Cars[]> {
    return this.carRespository.find({ where: { brand } });
  }
  
}
