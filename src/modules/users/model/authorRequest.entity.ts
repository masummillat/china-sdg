import { UserInterface } from '../interface/user.interface';
import { UserEntity } from './user.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Entity,
} from 'typeorm';

@Entity('authorRequests')
export class AuthorRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ nullable: false, default: false })
  read: boolean;

  @Column({ nullable: false, default: false })
  isAccept: boolean;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  author: UserInterface;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
