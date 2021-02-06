import { Injectable, UseGuards } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
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

import { S3 } from 'aws-sdk';
import { Logger } from '@nestjs/common';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';

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

  findTags(): Observable<BlogEntry[]> {
    return from(this.blogRepository.find({ select: ['tags'] }));
  }

  findAll(
    options: IPaginationOptions,
    tag: any,
    isPublished: boolean,
  ): Observable<Pagination<BlogEntry>> {
    if (isPublished) {
      return from(
        paginate<BlogEntry>(this.blogRepository, options, {
          relations: ['author', 'categories'],
          where: { tags: Like(`%${tag || ''}%`), isPublished: true },
        }),
      ).pipe(map((blogEntries: Pagination<BlogEntry>) => blogEntries));
    }

    return from(
      paginate<BlogEntry>(this.blogRepository, options, {
        relations: ['author', 'categories'],
        where: { tags: Like(`%${tag || ''}%`) },
      }),
    ).pipe(map((blogEntries: Pagination<BlogEntry>) => blogEntries));
  }

  generateSlug(title: string): Observable<string> {
    return of(slugify(title));
  }

  async upload(file: { buffer?: any; originalname?: any }) {
    const bucketS3 = 'jinpost-bucket/images';
    const filename: string =
      path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
    const extension: string = path.parse(file.originalname).ext;
    return this.uploadS3(file.buffer, bucketS3, `${filename}${extension}`);
  }

  async uploadS3(file: any, bucket: string, name: any) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err: { message: any }, data: unknown) => {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }
  getS3() {
    return new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }
}
