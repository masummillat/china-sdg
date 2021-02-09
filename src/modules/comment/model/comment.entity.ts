import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/model/user.entity';
import { UserInterface } from '../../users/interface/user.interface';
import { BlogEntry } from '../../blog/model/blog-entry.interface';
import { BlogEntryEntity } from '../../blog/model/blog-entry.entity';

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @ManyToOne((type) => UserEntity, (user: UserInterface) => user)
  author: UserEntity;

  @ManyToOne((type) => BlogEntryEntity, (blog: BlogEntry) => blog.comments)
  blog: BlogEntry;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
