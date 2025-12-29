import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('users')
export class user {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
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
