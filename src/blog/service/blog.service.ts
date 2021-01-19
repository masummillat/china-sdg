import { Injectable, UseGuards } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BlogEntryEntity } from '../model/blog-entry.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../../users/users.service';
import { UserDto } from '../../users/dto/user.dto';
import { BlogEntry } from '../model/blog-entry.interface';
import { from, Observable, of } from 'rxjs';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { switchMap, map } from 'rxjs/operators';
import { CategoriesService } from '../../categories/categories.service';
import {
  Pagination,
  paginate,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const slugify = require('slugify');
@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntryEntity)
    private readonly blogRepository: Repository<BlogEntryEntity>,
    private usersService: UsersService,
    private categoriesService: CategoriesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  create(user: UserDto, blogEntry: BlogEntry): Observable<BlogEntry> {
    blogEntry.author = user;
    return this.generateSlug(blogEntry.title).pipe(
      switchMap((slug: string) => {
        blogEntry.slug = slug;
        return from(this.blogRepository.save(blogEntry));
      }),
    );
  }
  findOne(id: number): Observable<BlogEntry> {
    return from(
      this.blogRepository.findOne(
        { id },
        { relations: ['author', 'categories'] },
      ),
    );
  }
  updateOne(id, blogEntry): Observable<BlogEntry> {
    if (!blogEntry.title) {
      return from(this.blogRepository.update(id, blogEntry)).pipe(
        switchMap(() => this.findOne(id)),
      );
    }
    return this.generateSlug(blogEntry.title).pipe(
      switchMap((slug: string) => {
        blogEntry.slug = slug;

        return from(this.blogRepository.save(blogEntry)).pipe(
          switchMap(() => this.findOne(id)),
        );
      }),
    );
  }
  deleteOne(id: number): Observable<any> {
    return from(this.blogRepository.delete(id));
  }
  // findAll(): Observable<BlogEntry[]> {
  //   return from(
  //     this.blogRepository.find({ relations: ['author', 'categories'] }),
  //   );
  // }

  findAll(options: IPaginationOptions): Observable<Pagination<BlogEntry>> {
    return from(
      paginate<BlogEntry>(this.blogRepository, options, {
        relations: ['author', 'categories'],
      }),
    ).pipe(map((blogEntries: Pagination<BlogEntry>) => blogEntries));
  }

  generateSlug(title: string): Observable<string> {
    return of(slugify(title));
  }
}
