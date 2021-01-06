import {
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/user.entity';
import { CategoryEntryEntity } from '../../categories/model/category-entry.entity';
import { CategoryEntry } from '../../categories/model/category.entry';
import { UserDto } from '../../users/dto/user.dto';

@Entity('blog')
export class BlogEntryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column({ default: '' })
  description: string;

  @Column({ type: 'longtext' })
  body: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }

  @Column({ default: 0 })
  likes: number;

  @Column({ nullable: true })
  featuredImg: string;

  @Column({ nullable: true })
  publishedDate: Date;

  @Column({ nullable: true })
  isPublished: boolean;

  @ManyToOne((type) => UserEntity, (user: UserDto) => user.blogs)
  author: UserEntity;

  // @ManyToMany(() => CategoryEntryEntity, {
  //   cascade: true,
  // })
  // @JoinTable()
  // categories: CategoryEntry[];
  @ManyToMany(
    () => CategoryEntryEntity,
    (category: CategoryEntry) => category.blogs,
  )
  @JoinTable()
  categories: CategoryEntry[];
}
