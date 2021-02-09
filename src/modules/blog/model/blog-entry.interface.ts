import { TagEntry } from '../../categories/model/tag.interface';
import { UserInterface } from '../../users/interface/user.interface';
import { CategoryEntry } from '../../categories/interface/category.entry';
import { IComment } from '../../comment/interface/IComment';
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
  author?: UserInterface;
  featuredImg?: string;
  publishedDate?: Date;
  isPublished?: boolean;
  tags?: string[];
  categories?: CategoryEntry[];
  comments?: IComment[];
}
