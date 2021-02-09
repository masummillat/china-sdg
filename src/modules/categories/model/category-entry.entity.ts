import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BlogEntryEntity } from '../../blog/model/blog-entry.entity';
import { BlogEntry } from '../../blog/model/blog-entry.interface';

@Entity('category')
export class CategoryEntryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(
    () => BlogEntryEntity,
    (blogEntry: BlogEntry) => blogEntry.categories,
  )
  public blogs: BlogEntry[];

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
