import {
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/model/user.entity';
import { CategoryEntryEntity } from '../../categories/model/category-entry.entity';
import { CategoryEntry } from '../../categories/interface/category.entry';
import { UserInterface } from '../../users/interface/user.interface';
import { IComment } from '../../comment/interface/IComment';
import { CommentEntity } from '../../comment/model/comment.entity';
import { BlogType } from './blog-entry.interface';

@Entity('blog')
export class BlogEntryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: '' })
  chineseTitle: string;

  @Column()
  slug: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  chineseDescription: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'text', default: '' })
  chineseBody: string;

  @Column({ default: 'free' })
  type: BlogType;

  @Column({ default: '' })
  note: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }

  @Column({ default: 0 })
  likes: number;

  @Column({ nullable: true })
  featuredImg: string;

  @Column('simple-array', { default: [] })
  tags: string[];

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  publishedDate: Date;

  @Column({ nullable: false, default: false })
  isPublished: boolean;

  @OneToMany(() => CommentEntity, (comment: IComment) => comment)
  comments: IComment[];

  @ManyToOne((type) => UserEntity, (user: UserInterface) => user.blogs)
  author: UserEntity;

  @ManyToMany(
    () => CategoryEntryEntity,
    (category: CategoryEntry) => category.blogs,
    {
      cascade: true,
    },
  )
  @JoinTable()
  categories: CategoryEntry[];
}
