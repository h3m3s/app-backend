import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository,  Between, MoreThanOrEqual, LessThanOrEqual} from 'typeorm';
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
  async searchCars(carData: Partial<Car>): Promise<Car[] | string> {
    const where: FindOptionsWhere<Cars> = {};

    if (carData.brand) where.brand = ILike(`%${carData.brand}%`);
    if (carData.model) where.model = ILike(`%${carData.model}%`);
    carData.minPrice ? (where.price = MoreThanOrEqual(carData.minPrice)) : null;
    carData.maxPrice ? (where.price = LessThanOrEqual(carData.maxPrice)) : null;
    if (carData.minPrice && carData.maxPrice) {
      where.price = Between(carData.minPrice, carData.maxPrice);
    }

    const cars = await this.carRespository.find({ where });
    return cars.length ? cars : 'Brak wyników';
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

  // Brand
  if (typeof carData.brand === 'string' && carData.brand.trim() !== '') {
    existing.brand = carData.brand.trim();
  }

  // Model
  if (typeof carData.model === 'string' && carData.model.trim() !== '') {
    existing.model = carData.model.trim();
  }

  // Price (frontend wysyła string)
  if (carData.price !== undefined && carData.price !== null) {
    const parsed = Number(carData.price);
    if (!isNaN(parsed)) {
      existing.price = parsed;
    }
  }

  // Photo — tutaj backend przyjmuje tylko nazwę pliku!
  if (typeof carData.photo === 'string' && carData.photo.trim() !== '') {
    existing.photo = carData.photo.trim();
  }

  return await this.carRespository.save(existing);
}
  
  
}
