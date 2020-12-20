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

@Entity('categories')
export class CategoryEntryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany((type) => BlogEntryEntity, (blogEntry) => blogEntry.id)
  @JoinTable()
  blogEntries: BlogEntry[];
}
