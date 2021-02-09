import { UserInterface } from './user.interface';
export interface AuthorRequest {
  id?: number;
  message?: string;
  read?: boolean;
  isAccept?: boolean;
  author?: UserInterface;
  createdAt?: Date;
  updatedAt?: Date;
}
