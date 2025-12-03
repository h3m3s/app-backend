import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Cars } from './car.entity';
import { user } from './user.entity';

@Entity('rent')
export class Rent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cars, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'car_id' })
  car: Cars;

  @RelationId((rent: Rent) => rent.car)
  carId: number;

  @Column({ name: 'start_date', type: 'timestamp' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp' })
  endDate: Date;

  @ManyToOne(() => user, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: user | null;

  @RelationId((rent: Rent) => rent.user)
  userId: number | null;
}
