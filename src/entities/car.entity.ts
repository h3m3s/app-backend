import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Rent } from './rent.entity';

// Map this entity to the existing `cars` table in your database
@Entity('cars')
export class Cars {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;
  
  @Column()
  photo: string;

  @OneToMany(() => Rent, (rent) => rent.car)
  rentals: Rent[];
}