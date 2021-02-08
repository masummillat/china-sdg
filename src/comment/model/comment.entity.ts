import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/user.entity';
import { UserDto } from '../../users/dto/user.dto';
import { BlogEntry } from '../../blog/model/blog-entry.interface';
import { BlogEntryEntity } from '../../blog/model/blog-entry.entity';

@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @ManyToOne((type) => UserEntity, (user: UserDto) => user)
  author: UserEntity;

  @ManyToOne((type) => BlogEntryEntity, (blog: BlogEntry) => blog.comments)
  blog: BlogEntry;
}