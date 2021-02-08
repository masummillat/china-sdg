import { UserDto } from '../../users/dto/user.dto';
import { BlogEntry } from '../../blog/model/blog-entry.interface';

export interface IComment {
  id?: number;
  message: string;
  author?: UserDto;
  blog?: BlogEntry;
}