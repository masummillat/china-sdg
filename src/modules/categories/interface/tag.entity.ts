import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { BlogEntryEntity } from 'src/modules/blog/model/blog-entry.entity';
import { BlogEntry } from 'src/modules/blog/model/blog-entry.interface';

@Entity('Tag')
export class TagEntryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: '' })
  name: string;

//   @ManyToMany(() => BlogEntryEntity, (blogEntry: BlogEntry) => blogEntry.tags)
//   public blogs: BlogEntry[];
}
