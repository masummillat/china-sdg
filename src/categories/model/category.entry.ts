import { BlogEntry } from '../../blog/model/blog-entry.interface';

export interface CategoryEntry {
  id?: number;
  name?: string;
  blogs?: BlogEntry[];
}
