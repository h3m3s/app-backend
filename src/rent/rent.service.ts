import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rent } from 'src/entities/rent.entity';
import { CarService } from 'src/car_rental/car.service';
import { Cars } from 'src/entities/car.entity';

interface RentPayload {
  startDate?: string | Date;
  endDate?: string | Date;
  start_date?: string | Date;
  end_date?: string | Date;
}

@Injectable()
export class RentService {
  constructor(
    @InjectRepository(Rent)
    private readonly rentRepository: Repository<Rent>,
    private readonly carService: CarService,
  ) {}

  async createForCar(carId: number, payload: RentPayload): Promise<Rent> {
    await this.ensureCarExists(carId);
    const startDate = this.requireDate(payload, 'startDate');
    const endDate = this.requireDate(payload, 'endDate');
    this.validateDateOrder(startDate, endDate);

    const rent = this.rentRepository.create({
      car: { id: carId } as Cars,
      startDate,
      endDate,
    });

    return this.rentRepository.save(rent);
  }

  findAll(): Promise<Rent[]> {
    return this.rentRepository.find({ order: { startDate: 'ASC' } });
  }

  async findByCar(carId: number): Promise<Rent[]> {
    await this.ensureCarExists(carId);
    return this.rentRepository.find({
      where: { car: { id: carId } },
      order: { startDate: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Rent> {
    const rent = await this.rentRepository.findOne({ where: { id } });
    if (!rent) throw new NotFoundException(`Rent entry with ID ${id} not found`);
    return rent;
  }

  async update(id: number, payload: RentPayload): Promise<Rent> {
    const rent = await this.findOne(id);
    const startDate = this.optionalDate(payload, 'startDate');
    const endDate = this.optionalDate(payload, 'endDate');

    if (!startDate && !endDate) {
      return rent;
    }

    const nextStart = startDate ?? rent.startDate;
    const nextEnd = endDate ?? rent.endDate;
    this.validateDateOrder(nextStart, nextEnd);

    if (startDate) rent.startDate = startDate;
    if (endDate) rent.endDate = endDate;

    return this.rentRepository.save(rent);
  }

  async remove(id: number): Promise<void> {
    const result = await this.rentRepository.delete(id);
    if (!result.affected) throw new NotFoundException(`Rent entry with ID ${id} not found`);
  }

  private async ensureCarExists(carId: number): Promise<void> {
    const car = await this.carService.findCarById(carId);
    if (!car) throw new NotFoundException(`Car with ID ${carId} not found`);
  }

  private requireDate(payload: RentPayload, field: 'startDate' | 'endDate'): Date {
    const value = this.optionalDate(payload, field);
    if (!value) {
      throw new BadRequestException(`${field} is required`);
    }
    return value;
  }

  private optionalDate(payload: RentPayload, field: 'startDate' | 'endDate'): Date | undefined {
    const exact = payload[field];
    const snake = payload[field === 'startDate' ? 'start_date' : 'end_date'];
    return this.normalizeDate(exact ?? snake, field);
  }

  private normalizeDate(value: string | Date | undefined, field: string): Date | undefined {
    if (value === undefined || value === null) return undefined;
    if (value instanceof Date && !isNaN(value.getTime())) {
      return value;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed.length) return undefined;
      const parsed = new Date(trimmed);
      if (isNaN(parsed.getTime())) {
        throw new BadRequestException(`${field} must be a valid date string (received: ${value})`);
      }
      return parsed;
    }

    throw new BadRequestException(`${field} must be a valid date`);
  }

  private validateDateOrder(start: Date, end: Date): void {
    if (start > end) {
      throw new BadRequestException('startDate must be before or equal to endDate');
    }
  }
}
