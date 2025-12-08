import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Cars } from './car.entity';

@Entity('users')
export class user {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'user' })
  username: string;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
    lastName: string;

  @Column()
    phone: number;

  @Column()
  password: string;

  @Column()
  isPermitted: boolean;
}
