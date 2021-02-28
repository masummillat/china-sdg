import { TagEntry } from '../../categories/model/tag.interface';
import { UserInterface } from '../../users/interface/user.interface';
import { CategoryEntry } from '../../categories/interface/category.entry';
import { IComment } from '../../comment/interface/IComment';

export enum BlogType {
  FREE = 'free',
  PREMIUM = 'premium',
}

export interface BlogEntry {
  id?: number;
  title?: string;
  chineseTitle?: string;
  slug?: string;
  description?: string;
  chineseDescription?: string;
  body?: string;
  chineseBody?: string;
  type?: BlogType;
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
  note?: string;
}
