import { BlogEntry } from '../../blog/model/blog-entry.interface';

export interface UserInterface {
  id?: number;
  name?: string;
  domain?: string;
  email?: string;
  password?: string;
  type?: string;
  bio?: string;
  occupation?: string;
  role?: UserRole;
  profileImage?: string;
  blogs?: BlogEntry[];
  createdAt?: Date;
  updatedAt?: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  AUTHOR = 'author',
  USER = 'user',
  MANAGER = 'manager',
  VIEWER = 'viewer',
}
