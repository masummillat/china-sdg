import { Injectable, UseGuards } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BlogEntryEntity } from '../model/blog-entry.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../../users/users.service';
import { UserDto } from '../../users/dto/user.dto';
import { BlogEntry } from '../model/blog-entry.interface';
import { from, Observable, of } from 'rxjs';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { switchMap } from 'rxjs/operators';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const slugify = require('slugify');
@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntryEntity)
    private readonly blogRepository: Repository<BlogEntryEntity>,
    private usersService: UsersService,
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
    return from(this.blogRepository.findOne({ id }, { relations: ['author'] }));
  }
  updateOne(id, blogEntry): Observable<BlogEntry> {
    return this.generateSlug(blogEntry.title).pipe(
      switchMap((slug: string) => {
        blogEntry.slug = slug;
        return from(this.blogRepository.update(id, blogEntry)).pipe(
          switchMap(() => this.findOne(id)),
        );
      }),
    );
  }
  deleteOne(id: number): Observable<any> {
    return from(this.blogRepository.delete(id));
  }
  findAll(): Observable<BlogEntry[]> {
    return from(this.blogRepository.find({ relations: ['author'] }));
  }

  generateSlug(title: string): Observable<string> {
    return of(slugify(title));
  }
}
