import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Cars } from 'src/entities/car.entity';
import type { Car } from 'src/interfaces/Car.interface';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Cars)
    private carRespository: Repository<Cars>,
  ) {}

  findAll(): Promise<Car[]> {
    return this.carRespository.find();
  }

  findCarById(id: number): Promise<Car | null> {
    return this.carRespository.findOne({ where: { id } });
  }
  async searchCars(carData: Car): Promise<object | string>{
    const where: FindOptionsWhere<Car> = {};

    carData.brand 
      ? where.brand = ILike(`%${carData.brand}%`) : null;
    carData.model 
      ? where.model = ILike(`%${carData.model}%`) : null;
    carData.price 
        ? where.price = carData.price : null;

    const cars = await this.carRespository.find({ where });
    return cars.length 
      ? cars : 'Brak Wyników';
  }
  findByBrand(brand: string): Promise<Car[]> {
    return this.carRespository.find({ where: { brand } });
  }
  async deleteCar(id: number): Promise<void> {
    let result = await this.carRespository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
  }
  
  async createCar(data: Car): Promise<Car> {
    return await this.carRespository.save(data);
  }
  async updateCar(id: number, carData: Partial<Car>): Promise<Car> {
    const existing = await this.carRespository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }

    // Merge provided fields
    if (typeof carData.brand === 'string') existing.brand = carData.brand;
    if (typeof carData.model === 'string') existing.model = carData.model;
    if (typeof carData.price === 'number' || carData.price === null)
      (existing as any).price = carData.price as any;

    return await this.carRespository.save(existing);

   
  }
  
  
}
