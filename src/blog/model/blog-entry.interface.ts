import { UserDto } from '../../users/dto/user.dto';
import { CategoryEntry } from '../../categories/model/category.entry';
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
  tags?: string[];
  categories?: CategoryEntry[];
}
