import { BlogEntry } from '../../blog/model/blog-entry.interface';

export interface UserDto {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  bio?: string;
  occupation?: string;
  role?: UserRole;
  profileImage?: string;
  blogEntries?: BlogEntry[];
}

export enum UserRole {
  ADMIN = 'admin',
  AUTHOR = 'AUTHOR',
  USER = 'user',
  MANAGER = 'manager',
}
