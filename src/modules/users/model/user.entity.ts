import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from '../interface/user.interface';
import { BlogEntryEntity } from '../../blog/model/blog-entry.entity';
import { SubscriptionEntity } from '../../subscription/model/subscription.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true, nullable: false, default: '' })
  domain: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: 'user' })
  type: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'text' })
  bio: string;

  @Column({ default: '' })
  occupation: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ nullable: true })
  profileImage: string;

  @OneToMany(
    (type) => BlogEntryEntity,
    (blogEntryEntity) => blogEntryEntity.author,
  )
  blogs: BlogEntryEntity[];

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(
    (type) => SubscriptionEntity,
    (subscriptionEntity) => subscriptionEntity.author,
  )
  subscriptions: SubscriptionEntity[];

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @BeforeInsert()
  createDomain() {
    this.domain = this.name.replace(/\s+/g, '').toLowerCase();
  }
}
