import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
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
}
