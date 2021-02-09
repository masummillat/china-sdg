import { UserInterface } from '../../users/interface/user.interface';
import { BlogEntry } from '../../blog/model/blog-entry.interface';

export interface IComment {
  id?: number;
  message: string;
  author?: UserInterface;
  blog?: BlogEntry;
  createdAt?: Date;
  updatedAt?: Date;
}
