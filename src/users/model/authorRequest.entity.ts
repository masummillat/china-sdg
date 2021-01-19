import { UserDto } from '../dto/user.dto';
import { UserEntity } from '../user.entity';
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

  @Column({ type: 'longtext', nullable: true })
  message: string;

  @Column({ nullable: false, default: false })
  read: boolean;

  @Column({ nullable: false, default: false })
  isAccept: boolean;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  author: UserDto;
}
