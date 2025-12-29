import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, In, LessThan, LessThanOrEqual, Like, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { Cars } from 'src/entities/car.entity';
import { Rent } from 'src/entities/rent.entity';
import type { Car } from 'src/interfaces/Car.interface';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Cars)
    private carRespository: Repository<Cars>,
    @InjectRepository(Rent)
    private rentRepository: Repository<Rent>,
  ) {}

  findAll(): Promise<Car[]> {
    return this.carRespository.find();
  }

  findCarById(id: number): Promise<Car | null> {
    return this.carRespository.findOne({ where: { id } });
  }
  async searchCars(carData: Partial<Car>): Promise<Car[] | string> {
    const brand = this.normalizeString(carData.brand);
    const model = this.normalizeString(carData.model);
    const minPrice = this.normalizeNumber(carData.minPrice);
    const maxPrice = this.normalizeNumber(carData.maxPrice);
    const startDate = this.normalizeDateInput(carData.startDate);
    const endDate = this.normalizeDateInput(carData.endDate);

    // Debug logs removed

    const where: FindOptionsWhere<Cars> = {};

    if (brand) {
      where.brand = Like(`%${brand}%`);
    }

    if (model) {
      where.model = Like(`%${model}%`);
    }

    if (typeof minPrice === 'number' && typeof maxPrice === 'number') {
      where.price = Between(minPrice, maxPrice);
    } else if (typeof minPrice === 'number') {
      where.price = MoreThanOrEqual(minPrice);
    } else if (typeof maxPrice === 'number') {
      where.price = LessThanOrEqual(maxPrice);
    }

    const cars = await this.carRespository.find({
      where,
      order: { brand: 'ASC', model: 'ASC' },
    });

    if (!cars.length) {
      return 'Brak wyników';
    }

    let filtered = cars;
    if (startDate && endDate) {
      // Backend validation: reject invalid ranges
      if (startDate.getTime() > endDate.getTime()) {
        throw new Error('Invalid date range: startDate must be before or equal to endDate');
      }
      const [from, to] = [startDate, endDate];
      const carIds = cars.map((car) => car.id).filter((id): id is number => typeof id === 'number');

      // Availability window computed

      if (carIds.length) {
        const overlapping = await this.rentRepository.find({
          where: {
            car: { id: In(carIds) },
            startDate: LessThan(to),
            endDate: MoreThan(from),
          },
        });

        // Overlapping rentals fetched

        // Use relationId accessor (carId) to avoid relying on optional relation load
        const busyIds = new Set(
          overlapping
            .map((rent) => (rent as any).carId ?? rent.car?.id)
            .filter((id): id is number => typeof id === 'number')
        );

        // Busy IDs identified
        
        // Mark reserved cars instead of filtering them out
        filtered = cars.map((car) => ({
          ...car,
          isReserved: busyIds.has(car.id),
        }));
      }
    }

    return filtered.length ? filtered : 'Brak wyników';
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

  private normalizeString(value: unknown): string | undefined {
    if (typeof value !== 'string') return undefined;
    const trimmed = value.trim();
    return trimmed.length ? trimmed : undefined;
  }

  private normalizeNumber(value: unknown): number | undefined {
    if (value === null || value === undefined) return undefined;
    if (typeof value === 'number' && !Number.isNaN(value)) return value;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed.length) return undefined;
      const parsed = Number(trimmed.replace(',', '.'));
      return Number.isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
  }

  private normalizeDateInput(value: unknown): Date | undefined {
    if (value === null || value === undefined) {
      return undefined;
    }
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value;
    }
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed.length) return undefined;
      const parsed = new Date(trimmed);
      // Date normalized
      return Number.isNaN(parsed.getTime()) ? undefined : parsed;
    }
    return undefined;
  }
  
  
}
