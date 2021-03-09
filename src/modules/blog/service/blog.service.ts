import { Injectable, Logger, UseGuards } from '@nestjs/common';
import { LessThan, Like, Raw, Repository } from 'typeorm';
import { BlogEntryEntity } from '../model/blog-entry.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../../users/service/users.service';
import { UserInterface } from '../../users/interface/user.interface';
import { BlogEntry, BlogType } from '../model/blog-entry.interface';
import { from, Observable, of } from 'rxjs';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { map, switchMap } from 'rxjs/operators';
import { CategoriesService } from '../../categories/service/categories.service';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Cron } from '@nestjs/schedule';
import path = require('path');

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

  @Cron('0 */5 * * * *')
  handleCron() {
    this.blogRepository
      .find({
        where: {
          publishedDate: LessThan(new Date()),
        },
      })
      .then((res) => {
        res.map((blog) => {
          if (!blog.isPublished) {
            let newBlog = new BlogEntryEntity();
            newBlog = blog;
            newBlog.isPublished = true;
            this.blogRepository.save(newBlog).then((r) => console.log(r));
          }
        });
      });
  }

  @UseGuards(JwtAuthGuard)
  create(user: UserInterface, blogEntry: BlogEntry): Observable<BlogEntry> {
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
    q: string,
  ): Observable<Pagination<BlogEntry>> {
    if (isPublished) {
      if (q.length > 0) {
        return from(
          paginate<BlogEntry>(this.blogRepository, options, {
            relations: ['author', 'categories'],
            where: {
              body: Raw(
                (alias) =>
                  `LOWER(${alias}) Like '%${q.toString().toLowerCase()}%'`,
              ),
              isPublished: true,
            },
            order: {
              id: 'DESC',
            },
          }),
        ).pipe(map((blogEntries: Pagination<BlogEntry>) => blogEntries));
      }
      return from(
        paginate<BlogEntry>(this.blogRepository, options, {
          relations: ['author', 'categories'],
          where: {
            tags: Like(`%${tag || ''}%`),
            isPublished: true,
          },
          order: {
            id: 'DESC',
          },
        }),
      ).pipe(map((blogEntries: Pagination<BlogEntry>) => blogEntries));
    }

    return from(
      paginate<BlogEntry>(this.blogRepository, options, {
        relations: ['author', 'categories'],
        where: {
          tags: Like(`%${tag || ''}%`),
        },
        order: {
          id: 'DESC',
        },
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
