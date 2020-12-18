import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BlogEntry } from '../../blog/model/blog-entry.interface';

@Entity('category_entry')
export class CategoryEntryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
