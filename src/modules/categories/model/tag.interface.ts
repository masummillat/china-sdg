import { BlogEntry } from '../../blog/model/blog-entry.interface';

export interface TagEntry {
  id?: number;
  name: string;
  blogs?: BlogEntry[];
}
