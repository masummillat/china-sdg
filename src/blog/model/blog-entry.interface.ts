import { TagEntry } from './../../categories/model/tag.interface';
import { UserDto } from '../../users/dto/user.dto';
import { CategoryEntry } from '../../categories/model/category.entry';
import { IComment } from '../../comment/model/IComment';
export interface BlogEntry {
  id?: number;
  title?: string;
  chineseTitle?: string;
  slug?: string;
  description?: string;
  chineseDescription?: string;
  body?: string;
  chineseBody?: string;
  createdAt?: Date;
  updatedAt?: Date;
  likes?: number;
  author?: UserDto;
  featuredImg?: string;
  publishedDate?: Date;
  isPublished?: boolean;
  tags?: string[];
  categories?: CategoryEntry[];
  comments?: IComment[]
}
