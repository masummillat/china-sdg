import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from './service/blog.service';
import { BlogEntry } from './model/blog-entry.interface';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('blogs')
export class BlogController {
  constructor(private blogService: BlogService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() blogEntry: BlogEntry, @Request() req): Observable<BlogEntry> {
    const user = req.user;
    console.log(req.user);
    console.log(req.roles);
    return this.blogService.create(user, blogEntry);
  }
  @Get(':id')
  findBlog(@Param('id') id: number): Observable<BlogEntry> {
    return this.blogService.findOne(id);
  }
  @Put(':id')
  updateBlog(
    @Param('id') id: string,
    @Body() blogEntry: BlogEntry,
  ): Observable<BlogEntry> {
    return this.blogService.updateOne(id, blogEntry);
  }
  @Delete(':id')
  deleteOne(@Param('id') id: number): Observable<any> {
    return this.blogService.deleteOne(id);
  }
  @Get()
  findAllBlogs(): Observable<BlogEntry[]> {
    return this.blogService.findAll();
  }
}
