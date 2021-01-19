import { UserDto } from './user.dto';
export interface AuthorRequest {
  id?: number;
  message?: string;
  read?: boolean;
  isAccept?: boolean;
  author?: UserDto;
}
