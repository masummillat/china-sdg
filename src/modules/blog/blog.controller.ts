import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Query,
  Logger, Req,
} from '@nestjs/common';
import { BlogService } from './service/blog.service';
import { BlogEntry } from './model/blog-entry.interface';
import { Observable, of } from 'rxjs';
import { JwtAuthGuard, Public } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Image } from './model/Image.interface';
import { join } from 'path';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserIsAuthorGuard } from './guards/userIsAuthor.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '../users/interface/user.interface';
import path = require('path');
import { Pagination } from 'nestjs-typeorm-paginate';

export const storage = {
  storage: diskStorage({
    destination: './uploads/blog-entry-images',
    filename: (req, file, cb) => {
      console.log(file);
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('blogs')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Public()
  @Get('/tags')
  findAllTags(): Observable<BlogEntry[]> {
    return this.blogService.findTags();
  }

  @Roles(UserRole.ADMIN, UserRole.AUTHOR)
  @Post()
  create(@Body() blogEntry: BlogEntry, @Request() req): Observable<BlogEntry> {
    console.log(blogEntry);
    const user = req.user;
    return this.blogService.create(user, blogEntry);
  }

  @Public()
  @Get(':id')
  findBlog(@Param('id') id: number): Observable<BlogEntry> {
    return this.blogService.findOne(id);
  }

  @Roles(UserRole.ADMIN, UserRole.AUTHOR)
  @UseGuards(UserIsAuthorGuard)
  @Put(':id')
  updateBlog(
    @Param('id') id: string,
    @Body() blogEntry: BlogEntry,
  ): Observable<BlogEntry> {
    return this.blogService.updateOne(id, blogEntry);
  }

  @Roles(UserRole.ADMIN, UserRole.AUTHOR)
  @UseGuards(UserIsAuthorGuard)
  @Delete(':id')
  deleteOne(@Param('id') id: number): Observable<any> {
    return this.blogService.deleteOne(id);
  }

  @Public()
  @Get()
  findAllBlogs(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('tag') tag,
    @Query('q') q = '',
    @Query('isPublished') isPublished = false,
    @Query('subscription') subscription = false,
  ): Observable<Pagination<BlogEntry>> {
    return this.blogService.findAll(
      {
        limit: Number(limit),
        page: Number(page),
        route: `${process.env.BASE_URL}/blogs`,
      },
      tag,
      isPublished,
      q,
      subscription,
    );
  }

  @Post('image/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file): Promise<any> {
    return await this.blogService.upload(file);
  }

  @Public()
  @Get('image/:imagename')
  // eslint-disable-next-line @typescript-eslint/ban-types
  findImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
    return of(
      res.sendFile(
        join(process.cwd(), 'uploads/blog-entry-images/' + imagename),
      ),
    );
  }
}
