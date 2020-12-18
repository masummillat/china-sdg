import { UserDto } from '../../users/dto/user.dto';
export interface BlogEntry {
  id?: number;
  title?: string;
  slug?: string;
  description?: string;
  body?: string;
  createdAt?: Date;
  updatedAt?: Date;
  likes?: number;
  author?: UserDto;
  featuredImg?: string;
  publishedDate?: Date;
  isPublished?: boolean;
}
