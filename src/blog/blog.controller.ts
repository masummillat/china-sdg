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
import { UserRole } from '../users/dto/user.dto';
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
  ): Observable<Pagination<BlogEntry>> {
    // limit = limit > 100 ? 100 : limit;
    return this.blogService.findAll({
      limit: Number(limit),
      page: Number(page),
      route: `${process.env.BASE_URL}/blogs`,
    });
  }

  @Post('image/upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file, @Request() req): Observable<Image> {
    file.url = `http://localhost:3000/blogs/image/${file.filename}`;
    return of(file);
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
